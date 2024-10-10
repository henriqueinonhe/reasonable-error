# Reasonable Error

Create type-safe custom error classes with a specific reason + associated context.

```ts
import { createErrorClass } from "reasonable-error";

type ReasonContextMap = {
  ValidationError: {
    paths: Array<string>;
  };
  UnknownError: undefined;
  NotAuthorized: {
    missingRoles: Array<string>;
  };
};

const { CreateUserError, isCreateUserError } =
  createErrorClass<ReasonContextMap>()("CreateUserError");

const createUser = () => {
  //...

  throw new CreateUserError("Not authorized to create user!", {
    reason: "NotAuthorized",
    context: {
      missingRoles: ["user:write"],
    },
  });

  //...
};
```
