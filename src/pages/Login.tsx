import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { LOGIN_FORM } from "../data";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaLogin } from "../validation";
import axiosInstance from "../config/axios.config";
import { AxiosError } from "axios";
import { IErrorHandler } from "../interfaces";
import { useState } from "react";
import toast from "react-hot-toast";

interface Inputs {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schemaLogin) });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    /**
     * * 1 - pending
     */

    try {
      // ** 2 - fulfilled => SUCCESS => (OPTIONAL)
      const { status, data: resData } = await axiosInstance.post(
        "/auth/local",
        data
      );
      if (status === 200) {
        console.log(resData);
        toast.success("You Will Navigate To home Page In 2 Seconds 🎉🎉🎉", {
          position: "top-right",
          duration: 4000,
          style: {
            backgroundColor: "#1b167a",
            color: "white",
            width: "fit-content",
          },
        });
      }
      localStorage.setItem("loggedInUser", JSON.stringify(resData));
      setTimeout(() => {
        location.replace("/");
      }, 1500);
    } catch (error) {
      // ** 3 - Rejected => FAILED => (OPTIONAL)
      const errorObj = error as AxiosError<IErrorHandler>;
      toast.error(`${errorObj.response?.data.error.message} ❌`, {
        position: "top-right",
        duration: 4000,
        style: {
          backgroundColor: "#1b167a",
          color: "white",
          width: "fit-content",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  //** Rendering
  const loginFormInput = LOGIN_FORM.map(
    ({ name, type, placeholder, validation }, idx) => (
      <div key={idx}>
        <Input
          type={type}
          placeholder={placeholder}
          {...register(name, validation)}
        />
        {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
      </div>
    )
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {loginFormInput}
        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
