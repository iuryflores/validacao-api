import { Schema, model } from "mongoose";

const userAsgard = new Schema(
  {
    iduserasgard: { type: String },
    nome: { type: String },
    cpf: { type: String },
    departamento_id: { type: String },
    login: { type: String },
  },
  { timestamps: true }
);
export default model("UserAsgard", userAsgard);
