import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../../api/main.router'

export const trpc = createTRPCReact<AppRouter>()
