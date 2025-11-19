import { NextFunction, Request, Response } from "express"
import { ZodError, z } from "zod"

export function validateQuery(schema: z.ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
        // Valida a query string contra o schema
        schema.parse(req.query)
        next()
        } catch (error) {
        if (error instanceof ZodError) {
            const formatedErrors = error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }))

            return res.status(400).json({
                message: "Erro de validação nos parâmetros de consulta.",
                errors: formatedErrors,
            })
        }
        next(error)
        }
    }
}