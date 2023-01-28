import { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InvalidText from "../components/InvalidText";
import { ScaleLoader } from "react-spinners";
import {
  AiFillEyeInvisible as ClosedEye,
  AiFillEye as OpenedEye,
} from "react-icons/ai";
import {
  loginSchema,
  loginSchemaType,
} from "../src/server/lib/zod/UserSchemas";
import { trpc } from "../src/utils/trpcNext";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<any>();
  const [showPassowrd, setShowPassowrd] = useState(false);
  const utils = trpc.useContext();
  const { mutateAsync: login, isLoading: loading } =
    trpc.user.login.useMutation({
      onSuccess() {
        utils.user.me.invalidate();
      },
    });

  const {
    register: loginForm,
    handleSubmit,
    formState,
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: loginSchemaType) => {
    if (!data) return;
    const user = await login({
      ...data,
    });
    if (!user?.errors || user.errors.length <= 0) {
      router.push("/home");
    } else {
      setErrors(user.errors[0]);
    }
  };
  const handleShowPassword = () => setShowPassowrd(!showPassowrd);
  return (
    <section className="h-screen bg-skin-main text-white">
      <div className="h-full px-6">
        <div className="flex h-full flex-col flex-wrap items-center justify-center xl:justify-center">
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-4/12">
            <div className="flex flex-row items-center justify-center text-center">
              <p className="gradient-text p-3 text-4xl">Log in with</p>
              {/* <AuthProviders /> */}
            </div>

            <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t after:border-gray-300">
              <p className="mx-4 mb-0 text-center font-semibold">Or</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {errors ? (
                errors.message.includes("oauth account") ? (
                  <div className="flex items-center py-4 text-red-400">
                    <div className="h-[5px] w-[5px] rounded bg-red-400"></div>
                    <span className="ml-5">{errors.message}</span>
                  </div>
                ) : (
                  <div className="flex items-center py-4 text-red-400">
                    <div className="h-[5px] w-[5px] rounded bg-red-400"></div>
                    <p className="ml-5">{errors.message}</p>
                  </div>
                )
              ) : null}
              <div className="relative pt-7 pb-4">
                <InvalidText message={formState?.errors["email"]?.message} />
                <input
                  className="text-input text-lg"
                  placeholder="Email address"
                  type="email"
                  {...loginForm("email")}
                />
              </div>

              <div className="relative pt-7 pb-4">
                <InvalidText message={formState?.errors["password"]?.message} />
                <div className="flex">
                  <input
                    className="text-input text-lg"
                    placeholder="Password"
                    type={showPassowrd ? "text" : "password"}
                    {...loginForm("password")}
                  />
                  <button onClick={handleShowPassword} type="button">
                    {showPassowrd ? (
                      <OpenedEye size={30} />
                    ) : (
                      <ClosedEye size={30} />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="text-md my-4 inline-block w-full
                   rounded bg-purple-500 px-7 py-2 font-medium 
                   leading-snug text-white shadow-md transition 
                   duration-200 ease-in-out hover:bg-purple-600 
                   hover:shadow-lg "
                >
                  {loading ? (
                    <ScaleLoader color="pink" height="25px" />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
            <div className="mb-6 flex items-center justify-between ">
              <a href="#!" className="underline">
                Forgot password?
              </a>
              <p className="px-3 text-sm font-semibold">
                {"Don't have an account? "}
                <a
                  href="register"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/register");
                  }}
                  className="inline text-purple-400 underline"
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
