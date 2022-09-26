// import * as npm from 'npm';
// import { readdirSync } from 'fs';
import { join } from 'path';
import { App, Duration, SecretValue, Stack, StackProps, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { AccessLogFormat, AuthorizationType, CognitoUserPoolsAuthorizer, LambdaRestApi, LogGroupLogDestination } from 'aws-cdk-lib/aws-apigateway';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { AttributeType, BillingMode, StreamViewType, Table, TableClass } from 'aws-cdk-lib/aws-dynamodb';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { LayerVersion, Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { DynamoEventSource, SnsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

interface WyldRydesStackProps extends StackProps {
  readonly lumigoNodeLayerVersion: number;
}

export class WyldRydesStack extends Stack {
  constructor(scope: Construct, id: string, props: WyldRydesStackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'WyldRydesVpc', {
      vpcName: 'WyldRydesVpc',
      cidr: '10.0.0.0/16',
      maxAzs: 3, // Default is all AZs in region
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'private-subnet',
          subnetType: SubnetType.PRIVATE_WITH_NAT,
          cidrMask: 24,
        },
        {
          name: 'public-subnet',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    const lumigoLayer = LayerVersion.fromLayerVersionArn(
      this,
      'LumigoLayer',
      `arn:aws:lambda:${props.env!.region}:114300393969:layer:lumigo-node-tracer:${props.lumigoNodeLayerVersion}`,
    );

    const unicornStableApi = '22o78sso8l.execute-api.us-east-1.amazonaws.com/dev';

    const unicornDispatchedTopic = new Topic(this, 'UnicornDispatchedTopic', {
      displayName: 'Unicorn Dispatched',
    });

    const frontendBucket = new Bucket(this, 'Frontend', {
      publicReadAccess: true,
      autoDeleteObjects: true,
      accessControl: BucketAccessControl.PUBLIC_READ,
      websiteIndexDocument: 'index.html',
      lifecycleRules: [
        {
          id: 'auto-removal',
          expiration: Duration.days(1),
        },
      ],
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const receiptsBucket = new Bucket(this, 'Receipts', {
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          id: 'auto-removal',
          expiration: Duration.days(1),
        },
      ],
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const unicornSalariesBucket = new Bucket(this, 'UnicornSalaries', {
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          id: 'auto-removal',
          expiration: Duration.days(1),
        },
      ],
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const occupiedUnicornsTable = new Table(this, 'OccupiedUnicornsTable', {
      tableName: 'OccupiedUnicorns',
      partitionKey: { name: 'UnicornName', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      tableClass: TableClass.STANDARD,
      billingMode: BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'Expiration',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const ridesTable = new Table(this, 'RidesTable', {
      tableName: 'Rides',
      partitionKey: { name: 'RideId', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      tableClass: TableClass.STANDARD,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const unicornStatsTable = new Table(this, 'UnicornStatsTable', {
      tableName: 'UnicornStats',
      partitionKey: { name: 'Name', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      tableClass: TableClass.STANDARD,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const lumigoTracerTokenSecret = SecretValue.secretsManager('AccessKeys', { jsonField: 'LumigoToken' }).toString();

    const requestUnicornLambda = new NodejsFunction(this, 'RequestUnicorn', {
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, 'lambdas', 'RequestUnicorn', 'handler.js'),
      depsLockFilePath: join(__dirname, 'lambdas', 'RequestUnicorn', 'package-lock.json'),
      memorySize: 256,
      environment: {
        LUMIGO_TRACER_TOKEN: lumigoTracerTokenSecret,
        AWS_LAMBDA_EXEC_WRAPPER: '/opt/lumigo_wrapper',
        UNICORN_STABLE_API: unicornStableApi,
        TABLE_NAME: occupiedUnicornsTable.tableName,
        TOPIC_ARN: unicornDispatchedTopic.topicArn,
      },
      layers: [lumigoLayer],
      vpc,
    });
    occupiedUnicornsTable.grantWriteData(requestUnicornLambda);
    unicornDispatchedTopic.grantPublish(requestUnicornLambda);

    const calcSalariesLambda = new NodejsFunction(this, 'CalcSalaries', {
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, 'lambdas', 'CalcSalaries', 'handler.js'),
      depsLockFilePath: join(__dirname, 'lambdas', 'CalcSalaries', 'package-lock.json'),
      memorySize: 256,
      environment: {
        LUMIGO_TRACER_TOKEN: lumigoTracerTokenSecret,
        AWS_LAMBDA_EXEC_WRAPPER: '/opt/lumigo_wrapper',
        UNICORN_STABLE_API: unicornStableApi,
        BUCKET_NAME: unicornSalariesBucket.bucketName,
        TABLE_NAME: unicornStatsTable.tableName,
      },
      layers: [lumigoLayer],
      vpc,
    });
    new Rule(this, 'calculate-salaries-schedule', {
      schedule: Schedule.cron({
        minute: `*/4`, // Every `4` minutes
      }),
      targets: [new LambdaFunction(calcSalariesLambda)],
    });
    unicornSalariesBucket.grantWrite(calcSalariesLambda);
    unicornStatsTable.grantReadWriteData(calcSalariesLambda);

    const uploadReceiptLambda = new NodejsFunction(this, 'UploadReceipt', {
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, 'lambdas', 'UploadReceipt', 'handler.js'),
      depsLockFilePath: join(__dirname, 'lambdas', 'UploadReceipt', 'package-lock.json'),
      memorySize: 256,
      environment: {
        LUMIGO_TRACER_TOKEN: lumigoTracerTokenSecret,
        AWS_LAMBDA_EXEC_WRAPPER: '/opt/lumigo_wrapper',
        BUCKET_NAME: receiptsBucket.bucketName,
      },
      layers: [lumigoLayer],
      vpc,
    });
    uploadReceiptLambda.addEventSource(new SnsEventSource(unicornDispatchedTopic));
    receiptsBucket.grantWrite(uploadReceiptLambda);

    const recordRideLambda = new NodejsFunction(this, 'RecordRide', {
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, 'lambdas', 'RecordRide', 'handler.js'),
      depsLockFilePath: join(__dirname, 'lambdas', 'RecordRide', 'package-lock.json'),
      memorySize: 256,
      environment: {
        LUMIGO_TRACER_TOKEN: lumigoTracerTokenSecret,
        AWS_LAMBDA_EXEC_WRAPPER: '/opt/lumigo_wrapper',
        TABLE_NAME: ridesTable.tableName,
      },
      layers: [lumigoLayer],
      vpc,
    });
    recordRideLambda.addEventSource(new SnsEventSource(unicornDispatchedTopic));
    ridesTable.grantWriteData(recordRideLambda);

    const sumRidesLambda = new NodejsFunction(this, 'SumRides', {
      runtime: Runtime.NODEJS_16_X,
      entry: join(__dirname, 'lambdas', 'SumRides', 'handler.js'),
      depsLockFilePath: join(__dirname, 'lambdas', 'SumRides', 'package-lock.json'),
      memorySize: 256,
      environment: {
        LUMIGO_TRACER_TOKEN: lumigoTracerTokenSecret,
        AWS_LAMBDA_EXEC_WRAPPER: '/opt/lumigo_wrapper',
        TABLE_NAME: unicornStatsTable.tableName,
      },
      layers: [lumigoLayer],
      vpc,
    });
    sumRidesLambda.addEventSource(new DynamoEventSource(ridesTable, {
      startingPosition: StartingPosition.TRIM_HORIZON,
      batchSize: 1,
    }));
    unicornStatsTable.grantWriteData(sumRidesLambda);

    const userPool = new UserPool(this, 'UserPool', {
      autoVerify: {
        email: true,
      },
      signInAliases: {
        username: true,
        preferredUsername: true,
        email: true,
      },
      selfSignUpEnabled: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool,
      authFlows: {
        userSrp: true,
        userPassword: true,
        adminUserPassword: true,
      },
      preventUserExistenceErrors: true,
    });

    const userAuthorizer = new CognitoUserPoolsAuthorizer(this, 'booksAuthorizer', {
      cognitoUserPools: [userPool]
    });

    const unicornApiLogGroup = new LogGroup(this, 'UnicornApiLogs', {
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const unicornApi = new LambdaRestApi(this, 'UnicornApi', {
      handler: requestUnicornLambda,
      proxy: false,
      deployOptions: {
        accessLogDestination: new LogGroupLogDestination(unicornApiLogGroup),
        accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
      },
    });
    const rideResource = unicornApi.root.addResource('ride', {
      defaultCorsPreflightOptions: {
        allowOrigins: [frontendBucket.bucketWebsiteUrl],
        allowMethods: ['OPTIONS', 'POST'],
        allowCredentials: true,
      },
    });
    rideResource.addMethod('POST', undefined, {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: userAuthorizer,
    });

    const unicornApiUrl = `${unicornApi.url.replace(/\/+$/, '')}/ride`;

    const frontendDeployment = new BucketDeployment(this, 'FrontendDeployment', {
      sources: [
        Source.asset(join(__dirname, 'frontend', 'dist'), {
          exclude: [
            join(__dirname, 'frontend', 'dist', 'js', 'config.json.template'),
          ],
        }),
        Source.jsonData(join('js', 'config.json'), {
          api: {
            invokeUrl: unicornApiUrl,
          },
          cognito: {
            userPoolId: userPool.userPoolId,
            userPoolClientId: userPoolClient.userPoolClientId,
            region: props.env!.region,
          }
        }),
      ],
      destinationBucket: frontendBucket,
      accessControl: BucketAccessControl.PUBLIC_READ,
      retainOnDelete: false,
    });
    frontendDeployment.node.addDependency(userPool, userPoolClient);

    new CfnOutput(this, 'AwsRegion', {
      value: env.region!,
    });

    new CfnOutput(this, 'UserPoolArn', {
      value: userPool.userPoolArn,
    });

    new CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    new CfnOutput(this, 'UnicornFrontendUrl', {
      value: frontendBucket.bucketWebsiteUrl + '/index.html',
    });

    new CfnOutput(this, 'UnicornApiUrl', {
      value: unicornApiUrl,
    });
  }
}

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// TODO Run `npm i` in the Lambda folders of find a way for the bundler to do that

// const currentFolder = process.cwd();
// readdirSync(__dirname)
//   .forEach((lambda) => {
//     const lambdaDir = join(__dirname, lambda);
//     process.chdir(lambdaDir);
//     npm.commands.install([], undefined);
//   });
// process.chdir(currentFolder);

const app = new App();

new WyldRydesStack(app, 'lumigo-workshop', {
  env,
  lumigoNodeLayerVersion: 209,
  tags: {
    LUMIGO_TAG: 'lumigo_workshop',
  }
});

app.synth();