export const createErrorClass =
  <ReasonContextMap extends Record<string, unknown>>() =>
  <ClassName extends string>(className: ClassName) => {
    type Reason = keyof ReasonContextMap;

    // We need to use this trick for the type predicate
    // to work correctly
    type ErrorClassInterface = Error & {
      reason: Reason;
    };

    type AdditionalInfo<SpecificReason extends Reason> = {
      reason: SpecificReason;
      cause?: Error;
    } & (ReasonContextMap[SpecificReason] extends undefined
      ? {}
      : {
          context: ReasonContextMap[SpecificReason];
        });

    const ErrorClass = class<SpecificReason extends Reason>
      extends Error
      implements ErrorClassInterface
    {
      constructor(
        message: string,
        { reason, cause }: AdditionalInfo<SpecificReason>,
      ) {
        super(message, {
          cause,
        });

        this.reason = reason;
      }

      public readonly reason: SpecificReason;
    };

    // As a class (which is actually just a function) name is readonly,
    // we need to use definedProperty in order to set it
    Object.defineProperty(ErrorClass, "name", { value: className });

    const isErrorClass = (value: unknown): value is ErrorClassInterface =>
      value instanceof ErrorClass;

    type CreateErrorClassReturnType = Record<ClassName, typeof ErrorClass> &
      Record<`is${ClassName}`, typeof isErrorClass>;

    return {
      [`${className}`]: ErrorClass<Reason>,
      [`is${className}`]: isErrorClass,
    } as CreateErrorClassReturnType;
  };
