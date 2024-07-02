import * as yup from "yup";

export const schemaRegister = yup
  .object({
    username: yup
      .string()
      .required("UserName Is Required!")
      .min(4, "Must be at least 4 characters"),
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email Is Required!")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must be a valid email"
      ),
    password: yup
      .string()
      .required("Password Is Required!")
      .min(6, "Must be at least 6 characters"),
  })
  .required();

export const schemaLogin = yup
  .object({
    identifier: yup
      .string()
      .email("Must be a valid email")
      .required("Email Is Required!")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must be a valid email"
      ),
    password: yup
      .string()
      .required("Password Is Required!")
      .min(6, "Must be at least 6 characters"),
  })
  .required();
