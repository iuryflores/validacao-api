import { Schema, model } from "mongoose";

const atosSchema = new Schema(
  {
    validado: { type: Boolean, default: false },
    ato: { type: Number },
    matriculaCodigo: { type: Number, ref: "Matricula" },
    user_id: { type: Schema.Types.ObjectId, ref: "Users" },
    userName: { type: String, required: true },
  },
  { timestamp: true }
);
export default model("Atos", atosSchema);
