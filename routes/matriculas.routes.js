import { Router } from "express";
import Matricula from "../models/Matricula.model.js";
import fs from "fs/promises";

const router = Router();

//Get all matriculas
router.get("/", async (req, res, next) => {
  try {
    const matriculas = await Matricula.find({ status: false });
    return res.status(200).json(matriculas);
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const matriculas = await Matricula.findById(id);
    console.log(matriculas);
    return res.status(200).json(matriculas);
  } catch (error) {
    console.log(error);
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
