import { Schema, model } from "mongoose";

const atoAsgard = new Schema(
  {
    idatoasgard: { type: String, require: true },
    validacao: { type: Date },
    codigo: { type: Number },
    livro: { type: String },
    indicador_real_id: { type: String, ref: "IndicadorReal" },
    usuario_validador_id: { type: String },
  },
  { timestamp: true }
);
export default model("AtoAsgard", atoAsgard);
