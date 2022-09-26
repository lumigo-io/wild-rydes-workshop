const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.43.1',
  defaultReleaseBranch: 'main',
  name: 'lumigo-workshop',
  devDeps: ['@types/aws-lambda', 'esbuild'],
});
project.synth();