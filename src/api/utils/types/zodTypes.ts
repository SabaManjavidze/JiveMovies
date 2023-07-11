import { z } from 'zod'

export const zodEmail = z.string().email()
export const zodPassword = z.string().min(6)

export const registerSchemaForm = z.object({
  email: zodEmail,
  password: zodPassword,
  username: z.string().min(5, '5 characters min').max(20, '20 characters max'),
  birthDate: z.date(),
  gender: z.enum(['Male', 'Female'])
})
export const registerSchema = z.object({
  email: zodEmail,
  password: zodPassword,
  username: z.string().min(5, '5 characters min').max(20, '20 characters max'),
  birthDate: z.date(),
  gender: z.enum(['Male', 'Female'])
})

export type registerSchemaType = z.infer<typeof registerSchema>
export type registerSchemaFormType = z.infer<typeof registerSchemaForm>
