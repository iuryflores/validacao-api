import { Schema, model } from "mongoose";

const users = new Schema(
  {
    iduserasgard: String,
    full_name: { type: String, required: true },
    login: { type: String },
    email: { type: String },
    departament: String,
    matricula_atual: Number,
    passwordHash: { type: String, required: true },
    house: { type: String },
    status: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    lastLogin: Date,
  },
  { timestamps: true }
);
export default model("Users", users);
