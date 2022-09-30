---
title: "Local Setup"
chapter: true
weight: 01
---

## Requirements

1. Node.js v14+ and NPM installed
1. A local Docker daemon installed that can run the `docker build` command
1. AWS CLI ([installation instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html))
1. AWS Cloud Development Kit (CDK) v2; if you do not have it installed, you can run:
   ```sh
   npm install -g aws-cdk
   ```

## Setup

Ensure that:

1. Your AWS CLI is configured to be used with the AWS account for this workshop.
   ```sh
   aws configure
   ```
1. The AWS CDK is bootstrapped in your AWS account:
   ```sh
   cdk bootstrap
   ```
