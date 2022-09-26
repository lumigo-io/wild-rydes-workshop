# Troubleshooting Amazon applications using Lambda, ECS and more!

Lumigo is a troubleshooting platform for serverless applications. With one-click distributed tracing, Lumigo lets developers effortlessly find & fix issues in serverless and microservices environments.

In this workshop, you will learn how easy it can be to debug AWS serverless applications with Lumigo using Wild Rydes, a complex microservice-based application built with AWS Lambda, Amazon ECS, and a lot of AWS-managed services.

## Learning Objectives

- Deploy a demo application using AWS CDK 2
- Use Lumigo to troubleshoot timeouts and business logic
- Identify slow dependencies and debug slow Lambda invocations and ECS requests
- Setting up alerts in Lumigo

## Expected Duration

1 Hour

## Who should take this workshop?

- Software Developers
- Infrastructure Engineers
- DevOps Engineers
- Solution Architects
- Site Reliability Engineers (SREs)
- Technical leads

## Requirements

1. Admin access to an AWS account (ideally a personal account not containing production infrastructure :-) )
2. An updated and configured installation of the AWS Cloud Development Kit (CDK) 2 (and if you do not have it, the tutorial will help you with that, see the [Getting started](#getting-started) section)

## Getting started

This repository contains a comprehensive tutorial that will guide you through the entire setup.
To start the tutorial:

1. Clone this repository locally:
   ```
   git clone git@github.com:lumigo-io/wild-rydes-workshop
   ```
   Open your local clone in a terminal.
1. Install [Hugo](https://gohugo.io/getting-started/installing/)
2. Start the Hugo server from the `tutorial` folder:
   ```sh
   (cd tutorial && hugo server -D)
   ```
   At the end of the shell output, there will be the local URL hosting the tutorial on your machine, which should be reachable at http://localhost:1313
