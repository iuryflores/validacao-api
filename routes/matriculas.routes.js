import { Router } from "express";
import Matricula from "../models/Matricula.model.js";
import fs from "fs/promises";

const router = Router();

//Get all matriculas
router.get("/", async (req, res, next) => {
  try {
    const allProcess = await Matricula.find({ status: true });
    return res.status(200).json(allProcess);
  } catch (error) {
    next(error);
  }
});
router.post("/inserir", async (req, res) => {
  try {
    // Ler o conteúdo do arquivo JSON
    const arquivo = await fs.readFile("./seeds/data.json", "utf-8");
    console.log(arquivo);
    const dados = JSON.parse(arquivo);

    // Inserir cada documento no banco de dados
    for (const item of dados) {
      const novoDocumento = new Matricula(item);
      await novoDocumento.save();
    }

    res.status(201).json({ mensagem: "Documentos inseridos com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});
export default router;
