import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

// partial type for validation target, allowing for optional body, query, and params schemas
type ValidationTarget = Partial<{
  body: ZodType;
  query: ZodType;
  params: ZodType;
}>;

export function validate(schemas: ValidationTarget) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      for (const key of Object.keys(schemas) as Array<keyof ValidationTarget>) {
        //  check if the schema exists for the current key (body, query, or params...etc)
        const schema = schemas[key];

        if (!schema) continue;

        // validate the corresponding part of the request (body, query, or params...etc) and replace it with the validated data
        req[key] = await schema.parseAsync(req[key]);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
