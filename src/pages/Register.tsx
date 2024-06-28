import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import { schemaRegister } from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorHandler } from "../interfaces";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}
const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(schemaRegister) });
  //** Handler
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    /**
     * * 1 - pending
     */

    try {
      // ** 2 - fulfilled => SUCCESS => (OPTIONAL)
      const { status } = await axiosInstance.post("/auth/local/register", data);
      if (status === 200) {
        toast.success("You Will Navigate To Login Page In 4 Seconds 🎉🎉🎉", {
          position: "top-right",
          duration: 4000,
          style: {
            backgroundColor: "#1b167a",
            color: "white",
            width: "fit-content",
          },
        });
      }
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
  const registerFormInput = REGISTER_FORM.map(
    ({ name, placeholder, type, validation }, idx) => (
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
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {registerFormInput}
        <Button fullWidth isLoading={isLoading}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
