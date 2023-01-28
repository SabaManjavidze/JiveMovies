import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InvalidText from "../components/InvalidText";
import Image from "next/image";
import {
  AiFillEyeInvisible as ClosedEye,
  AiFillEye as OpenedEye,
} from "react-icons/ai";
import { ScaleLoader } from "react-spinners";
// import AuthProviders from "../components/General/AuthProviders";
import { trpc } from "../src/utils/trpcNext";
import {
  registerSchema,
  registerSchemaType,
} from "../src/server/lib/zod/UserSchemas";

const Register: NextPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<any>();
  const utils = trpc.useContext();
  const [showPassowrd, setShowPassowrd] = useState(false);
  const { mutateAsync: register, isLoading: loading } =
    trpc.user.register.useMutation({
      onSuccess() {
        utils.user.me.invalidate();
      },
    });

  const {
    register: registerForm,
    handleSubmit,
    formState,
  } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: registerSchemaType) => {
    if (!data) return;
    const user = await register({
      ...data,
    });
    if (user) {
      router.push("/home");
    }
  };

  const handleShowPassword = () => setShowPassowrd(!showPassowrd);
  return (
    <section className="min-h-screen text-white bg-skin-main">
      <div className="h-full px-6">
        <div
          className="g-6 flex h-full flex-wrap items-center justify-center 
        xl:justify-center"
        >
          <div className="xs:w-1/2 text-lg mt-48  sm:w-3/4 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <div className="flex flex-row items-center justify-center">
              <p className="gradient-text p-3 text-4xl">Register With</p>
              {/* <AuthProviders /> */}
            </div>

            <div
              className="mt-4 mb-3 flex items-center before:mt-0.5 before:flex-1 before:border-t 
              before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t 
              after:border-gray-300"
            >
              <p className="mx-4 text-center font-semibold">Or</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {errors ? (
                <div className="flex items-center py-4 text-red-400">
                  <div className="h-[5px] w-[5px] rounded bg-red-400"></div>
                  <p className="ml-5">{errors.message}</p>
                </div>
              ) : null}
              {/* --------Username and Age------------- */}
              <div className="relative flex justify-between pt-9 pb-4">
                <div className="mr-4 flex flex-col items-start justify-center">
                  <InvalidText
                    message={formState?.errors["username"]?.message}
                  />
                  <input
                    placeholder="Username"
                    {...registerForm("username", { required: true })}
                    className="text-input"
                  />
                </div>
                <div className="ml-4 flex flex-col items-center justify-center">
                  <InvalidText message={formState?.errors["age"]?.message} />
                  <input
                    placeholder="Age"
                    type="number"
                    {...registerForm("age", { valueAsNumber: true })}
                    className="text-input"
                  />
                </div>
              </div>
              {/* -------- Gender ------------- */}
              <div className="w-full py-3">
                <label className="mb-2 block w-full text-xs font-bold uppercase tracking-wide ">
                  Gender
                </label>
                <div className="relative w-full">
                  <select
                    className="text-input w-full appearance-none rounded-t-xl focus:rounded-b-none"
                    {...registerForm("gender")}
                  >
                    <option>None</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* -------- Email and Password ------------- */}
              <div className="relative pt-7 pb-4">
                <InvalidText message={formState?.errors["email"]?.message} />
                <input
                  className="text-input"
                  placeholder="Email address"
                  type="email"
                  {...registerForm("email")}
                />
              </div>

              <div className="flex relative pt-7 pb-4">
                <InvalidText message={formState?.errors["password"]?.message} />
                <input
                  className="text-input"
                  placeholder="Password"
                  type="password"
                  {...registerForm("password")}
                />
                <button onClick={handleShowPassword} type="button">
                  {showPassowrd ? (
                    <OpenedEye size={30} />
                  ) : (
                    <ClosedEye size={30} />
                  )}
                </button>
              </div>

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="text-md inline-block w-full
                   rounded bg-purple-500 py-3 font-medium 
                   leading-snug text-white shadow-md transition 
                   duration-200 ease-in-out hover:bg-purple-600 
                   hover:shadow-lg "
                >
                  {loading ? (
                    <ScaleLoader color="pink" height="25px" />
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
            <div className="flex items-center justify-between pt-7 pb-4">
              <a href="#!" className="underline">
                Forgot password?
              </a>
              <p className="text-sm font-semibold">
                Already have an account?{" "}
                <a
                  href="login"
                  className="inline text-purple-400 underline"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/login");
                  }}
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Register;
