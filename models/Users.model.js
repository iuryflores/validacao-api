import { Schema, model } from "mongoose";

const users = new Schema(
  {
    full_name: { type: String, required: true },
    departament: String,
    passwordHash: { type: String, required: true },
    house: { type: String },
    status: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default model("Users", users);
