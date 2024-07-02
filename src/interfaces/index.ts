export interface IRegisterInput {
  name: "username" | "email" | "password";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export interface ILoginInput {
  name: "identifier" | "password";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}

export interface IErrorHandler {
  error: {
    // details?: {
    //   errors: {
    //     message: string;
    //   };
    // }[];
    message?: string;
  };
}

// export interface ITodo {
//   id: number;
//   title: string;
//   description: string;
// }
