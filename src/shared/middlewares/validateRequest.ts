import type { NextFunction, Request, Response } from "express"
import { ZodError, z } from "zod"

export function validateRequest(schema: z.ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            if (error instanceof ZodError) {

                const formatedErrors = error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }));

                return res.status(400).json({
                    message: "Erro de validação nos dados de entrada.",
                    errors: formatedErrors,
                })
            }
            next(error)
        }
    }
}