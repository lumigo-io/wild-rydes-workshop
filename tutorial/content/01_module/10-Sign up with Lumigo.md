---
title: "Sign up with Lumigo"
chapter: true
weight: 10
---

## Sign up with Lumigo

In this workshop, we will use [Lumigo](https://lumigo.io) to troubleshoot the Wild Rydes application.

[Sign-up](https://platform.lumigo.io/signup) for a free Lumigo account is quick and easy.
Enter your email and password, or sign up with your Google account.

![](/images/lumigo-mp-signup.png)

## Connect your AWS account

Connecting your environment allows Lumigo to gather the resources, metrics, and logs needed for monitoring and debugging your applications. 

Connecting to your AWS account is based on a CloudFormation template. 
Click **Connect to AWS** to open CloudFormation in a new tab with a "Quick create stack" form.

![](/images/lumigo-mp-connect.png)

You can leave the default settings as is.
Check **I acknowledge that AWS CloudFormation might create IAM resources** and click **Create stack**.

![](/images/lumigo-mp-create-stack.png)

Return to Lumigo and wait for AWS to deploy the stack.
Once completed, Lumigo will automatically continue to the next step.

## Onboarding

The onboarding process of Lumigo allows you to automatically trace Lambda functions and more!

![](/images/lumigo-mp-trace-onboarding.png)

For the sake of this tutorial, however, we won't need the automated tracing, as everything is already set up in the AWS CDK project.
Click on "Lambda", and then "Go to Lumigo".

Soon, your Lumigo account will learn about your AWS Lambda functions, Amazon ECS clusters, services and tasks, and more.
Time to give it something to trace: Wild Rydes!
