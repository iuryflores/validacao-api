import { Schema, model } from "mongoose";

const users = new Schema(
  {
    full_name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    departamento: String,
    cpf: { type: String, required: true },
    passwordHash: { type: String, required: true },
    status: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default model("Users", users);
