import { Schema, model } from "mongoose";

const indicadorReal = new Schema(
  {
    idrealasgard: { type: String, require: true },
    abertura: { type: Date, require: true },
    codigo: { type: Number },
    status: { type: String },
    ultimo_ato: { type: Number },
    livro: { type: String },
  },
  { timestamp: true }
);
export default model("IndicadorReal", indicadorReal);
