---
title: "View your application Lumigo"
chapter: true
weight: 1
---

## Viewing your application in Lumigo

Lumigo will trace the invocations of your application.
The first thing we will use it for is to get an understanding of how our application looks in real life.

* Click on the [System map](https://platform.lumigo.io/system-map) to have an overview of your application's architecture:

![Wild Rydes architecture](/images/mod02-lumigo-architecture.png)

Notice how this is identical to the architecture diagram we drew by hand, except it's drawn from the actual invocations that Lumigo has traced, so it's **always up-to-date** and based on actual data.

* Explore the different functions' stats and invocations in your account using the [Functions](https://platform.lumigo.io/functions) page:

![Wild Rydes functions](/images/mod02-lumigo-functions.png)

* Click into any of the functions to get more details on it:

![Lumigo function](/images/mod02-lumigo-function-details.png)

Clicking on the `Metrics` tab would show you some additional metrics like the number of cold starts as well as cold start durations.

![Lumigo function](/images/mod02-lumigo-function-details-2.png)

* Click on the ECS view, and it will provide an overview of the Elastic Container Service (ECS) clusters in your AWS account.

![Lumigo ECS view](/images/mod02-lumigo-ecs-clusters.png)

* Selecting a cluster, it will show you its utilization metrics, the services and single tasks running on it.

![Lumigo ECS view](/images/mod02-lumigo-ecs-cluster.png)

* Selecting the "Details" of an ECS service will show you information on how ti is configure, and enable you to jump to its view in the AWS console.

![Lumigo ECS view](/images/mod02-lumigo-ecs-services.png)

* Details can also be virtualized for single tasks.

![Lumigo ECS view](/images/mod02-lumigo-ecs-tasks.png)

* Also, don't forget to check out the [Explore](https://platform.lumigo.io/explore) page to have access to all the invocations traces by Lumigo:

![Lumigo traces](/images/mod02-lumigo-explore.png)

* If you click on any of the icons in the graph, you can see even more information about that resource, including any request and response to and fro the resource. For example, if you click on the `requestUnicorn` function, you should see its return value, invocation event, environment variables and its logs:

![Lumigo operation](/images/mod02-lumigo-operation-function.png)

Similarly, if you click on the `unicornDispatched` SNS topic, you will see the `sns.Publish` request that `requestUnicorn` function made to it. Notice that sensitive data like API keys and auth tokens are scrubbed and were never sent to Lumigo's backend in the first place.

![Lumigo operation](/images/mod02-lumigo-operation-sns.png)

Where a resource was accessed multiple times during a transaction, you can also iterate through all the individual requests too. For example, the `requestUnicorn` function did a `dynamodb.Get` and then `dynamodb.Put` against the `OccupiedUnicorns` table:

![Lumigo operation](/images/mod02-lumigo-operation-dynamodb.png)

Having all these information at your fingertips makes it easy for you to understand what **actually happened** during this transaction without spraying your code with manual instrumentation code!

* One final thing, click on `Timeline` shows you where the time was spent on this transaction to help you identify culprits when performance issues arise.

![Lumigo timeline](/images/mod02-lumigo-timeline.png)

Now that you know your way around Lumigo, let's use it to troubleshoot the issues we are seeing in the demo app.
