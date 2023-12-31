import { Schema, model } from "mongoose";

const matriculaSchema = new Schema(
  {
    status: { type: Boolean, default: false },
    codigo: { type: Number, required: true },
    qtdAtos: Number,
    validada: { type: Boolean, default: false },
    dataAbertura: { type: String, required: true },
  },
  { timestamp: true }
);
export default model("Matricula", matriculaSchema);
