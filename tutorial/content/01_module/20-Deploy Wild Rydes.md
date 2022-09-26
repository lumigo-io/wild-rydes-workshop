---
title: "Deploy Wild Rydes"
chapter: true
weight: 20
---

## Get the Lumigo Tracer Token

Lumigo tracers need a Lumigo token to be able to upload data to your Lumigo account.
Your Lumigo token is available in [Lumigo](https://platform.lumigo.io) under the `Settings -> Tracing -> Manual tracing` menu:

![](/images/lumigo-tracer-token.png)

## Store the Lumigo Tracer Token in AWS Secrets Manager

Create an AWS Secrets Manager secret called `AccessKeys` with the Lumigo Tracer Token stored in the `LumigoToken` field:

```sh
aws secretsmanager create-secret --name AccessKeys --secret-string '{"LumigoToken":"<REPLACE_ME>"}'
```

Be sure to replace in the command above the `<REPLACE_ME>` with your actual Lumigo token!

## Deploy

Time to deploy Wild Rydes and start our journey in troubleshooting it!

```sh
cdk deploy --all --require-approval never
```

(About `--require-approval never`: there are several AWS CDK stacks in this project, and you would not want to approve each one for this demo; just don't try this on prod :D)

The URL of the application frontend is provided in the `lumigo-workshop.UnicornFrontendUrl` output by the `cdk deploy` command you just ran:

```sh
$ cdk deploy --all --require-approval never

...

Outputs:
lumigo-workshop.AwsRegion = eu-central-1
lumigo-workshop.UnicornApiEndpointD12EDD30 = https://8f95ek969e.execute-api.eu-central-1.amazonaws.com/prod/
lumigo-workshop.UnicornApiUrl = https://8f95ek969e.execute-api.eu-central-1.amazonaws.com/prod/ride
lumigo-workshop.UnicornFrontendUrl = http://lumigo-workshop-frontend23d93c55-dnh259yn9crp.s3-website.eu-central-1.amazonaws.com/index.html
lumigo-workshop.UserPoolArn = arn:aws:cognito-idp:eu-central-1:170906415945:userpool/eu-central-1_D5FL6hUFz
lumigo-workshop.UserPoolClientId = 7fb48rfhi2f80g7pofiirtalu2
Stack ARN:
arn:aws:cloudformation:eu-central-1:170906415945:stack/lumigo-workshop/3ae15ee0-4016-11ed-a400-0ae116f02cb2
```

Open the URL provided as the value of `lumigo-workshop.UnicornFrontendUrl`, and you should see something like this:

![](/images/mod01-002.png)

That's it, you've successfully deployed the Wild Rydes demo app!


## Register and sign in

Opening your Wild Rydes app, you will see a bunch of awesome equines, and a call-to-action to "Giddy up!".
Press on "Giddy up!", and you will be redirected to the "Sign up" page.

![](/images/mod01-003.png)

You do not have a user yet, so pretty on "Register", and you will be redirected to the "Register" page.

![](/images/mod01-004.png)

After entering your email address and a sufficiently strong password, press on "Verify".
A verification email will be sent to your email address (check the Spam folder just in case!), and your browser will be redirected to the "Verification" page.

![](/images/mod01-005.png)

After verifying you new user, you will be brought to the "Ride" page, where you'll hail for a ryde.
Clicking anywhere on the map will summon a Unicorn to that location.

![](/images/mod01-006.png)

Click on the map to "request a Unicorn".
If the request was successful, then you'll a see unicorn appear and arrive at your marker.

However, request several unicorns at the same time, and you might see some errors popping up!

![](/images/mod01-007.png)

So, looks like there are a few problems in this app, let's find them with the help of Lumigo!
