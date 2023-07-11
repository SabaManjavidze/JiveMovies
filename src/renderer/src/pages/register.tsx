import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerSchemaForm,
  registerSchemaFormType
} from '../../../api/utils/types/zodTypes'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../components/ui/form'
import { trpc } from '../trpcClient'
import { DatePicker } from '@renderer/components/ui/date-picker'

const Register = () => {
  const { mutateAsync: register, isLoading } = trpc.user.register.useMutation()

  const navigate = useNavigate()

  const form = useForm<registerSchemaFormType>({
    resolver: zodResolver(registerSchemaForm),
    defaultValues: {
      email: '',
      username: '',
      birthDate: new Date(),
      password: '',
      gender: 'Male'
    }
  })

  const onSubmit = async (data: registerSchemaFormType) => {
    if (!data) return
    await register(data)
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
              <p className="gradient-text p-3 text-4xl">Register With</p>
            </div>

            <div
              className="mt-4 mb-3 flex items-center before:mt-0.5 before:flex-1 before:border-t 
              before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t 
              after:border-gray-300"
            >
              <p className="mx-4 text-center font-semibold">Or</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* --------Username and Age------------- */}
                <div className="relative flex justify-between pt-9 pb-4">
                  <div className="mr-4 w-full flex flex-col items-start justify-center">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="ml-4 w-full flex flex-col items-center justify-center">
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Date</FormLabel>
                          <DatePicker field={field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* -------- Gender ------------- */}
                <div className="w-full py-3">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange as any}>
                          <FormControl>
                            <SelectTrigger
                              defaultValue={field.value}
                              className="w-[180px]"
                            >
                              <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark">
                            <SelectGroup>
                              <SelectItem value={'Male'}>Male</SelectItem>
                              <SelectItem value={'Female'}>Female</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* -------- Email and Password ------------- */}
                <div className="flex justify-between">
                  <div className="mr-4 relative pt-7 pb-4 w-full">
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

                  <div className="ml-4 relative pt-7 pb-4 w-full">
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
                    Register
                  </Button>
                </div>
              </form>
            </Form>
            <div className="flex items-center justify-between pt-7 pb-4">
              <p className="text-sm font-semibold">
                Already have an account?{' '}
                <Link
                  to="/user/login"
                  className="inline text-purple-400 underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Register
