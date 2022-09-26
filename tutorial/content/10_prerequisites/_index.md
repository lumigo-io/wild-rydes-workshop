---
title: "Prerequisites"
chapter: true
weight: 10
---

# Workshop Prerequisites

{{% notice info %}}
**RECOMMENDATION**: you shouldn't perform this tutorial using your production AWS account.
Use your personal account, or a playground account.
{{% /notice %}}

In order to perform this tutorial, you need:

1. Node.js v14+ and NPM installed on your machine
1. A local Docker daemon installed on your machine (e.g., via [Docker Desktop](https://www.docker.com/products/docker-desktop/)) that can run the `docker build` command
1. AWS CLI ([installation instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html))
1. Local setup of the AWS CLI:
   ```sh
   aws configure
   ```
1. Install the AWS Cloud Development Kit (CDK) v2 with:
   ```sh
   npm install -g aws-cdk
   ```
1. Ensure the AWS CDK is bootstrapped in your AWS account:
   ```sh
   cdk bootstrap
   ```
