import { Schema, model } from "mongoose";

const matriculaSchema = new Schema(
  {
    status: { type: String, required: true },
    codigo: { type: Number, unique: true },
    qtdAtos: Number,
    validada: { type: Boolean, default: false },
    dataAbertura: { type: String, required: true },
  },
  { timestamp: true }
);
export default model("Matricula", matriculaSchema);
