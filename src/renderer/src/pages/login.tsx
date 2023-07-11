import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, loginSchemaType } from '../../../api/utils/types/zodTypes'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../components/ui/form'
import { trpc } from '../trpcClient'

const Login = () => {
  const { mutateAsync: login, isLoading } = trpc.user.login.useMutation()

  const navigate = useNavigate()

  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: loginSchemaType) => {
    if (!data) return
    await login(data)
    navigate('/?query=&page=1')
  }

  return (
    <section className="h-screen bg-background text-white">
      <div className="h-full px-6">
        <div
          className="g-6 flex h-full flex-wrap items-center justify-center 
        xl:justify-center"
        >
          <div className="xs:w-1/2 text-lg sm:w-3/4 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <div className="flex flex-row items-center justify-center">
              <p className="gradient-text p-3 text-4xl">Login With</p>
            </div>

            <div
              className="mt-4 mb-3 flex items-center before:mt-0.5 before:flex-1 before:border-t 
              before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t 
              after:border-gray-300"
            >
              <p className="mx-4 text-center font-semibold">Or</p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-center items-center"
              >
                {/* -------- Email and Password ------------- */}
                <div className="justify-center w-1/2">
                  <div className="relative pt-4 pb-4 w-full">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email Address"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="relative pt-4 pb-4 w-full">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <Button type="submit" isLoading={isLoading}>
                    Login
                  </Button>
                </div>
              </form>
            </Form>
            <div className="flex items-center justify-between pt-7 pb-4">
              <a href="#!" className="underline">
                Forgot password?
              </a>
              <p className="text-sm font-semibold">
                Don't have an account?
                <Link
                  to="/user/register"
                  className="inline text-purple-400 underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Login
