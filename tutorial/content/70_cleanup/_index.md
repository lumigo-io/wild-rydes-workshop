---
title: "Cleanup"
chapter: true
weight: 170
---

## Cleanup
{{% notice note %}}
If you are attending AWS Event and using one of provided AWS accounts than you can skip this section.
{{% /notice %}}

1. Delete `Lumigo-Workshop-Admin` IAM role

     ```
     aws iam detach-role-policy --role-name Lumigo-Workshop-Admin --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

     aws iam delete-role --role-name Lumigo-Workshop-Admin
     ```

1. Delete the demo: After you are done with the workshop, the demo application is removed with:

     ```
     cdk destroy --all
     ```
