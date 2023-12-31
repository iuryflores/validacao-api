import { Router } from "express";

import fs from "fs/promises";
import Users from "../models/Users.model.js";

import Matricula from "../models/Matricula.model.js";

const router = Router();

//Get all Matricula
router.get("/", async (req, res, next) => {
  try {
    const myMatricula = await Matricula.find()
      .sort({
        codigo: 1,
      })
      .limit(12000);

    return res.status(200).json(myMatricula);
  } catch (error) {
    next(error);
  }
});
router.get("/:matriculaCodigo", async (req, res, next) => {
  const { matriculaCodigo } = req.params;

  try {
    const myMatricula = await Matricula.findOne({ codigo: matriculaCodigo });
    return res.status(200).json(myMatricula);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/matricula/", async (req, res, next) => {
  try {
    const MatriculaNaoValidadas = await Matricula.find({
      validada: false,
    });
    console.log(MatriculaNaoValidadas);
    // Verifique se há alguma matrícula não validada
    if (MatriculaNaoValidadas.length === 0) {
      return res
        .status(404)
        .json({ msg: "Nenhuma matrícula não validada encontrada." });
    }

    // Gere um índice aleatório para selecionar uma matrícula
    const randomIndex = Math.floor(
      Math.random() * MatriculaNaoValidadas.length
    );
    const matriculaAleatoria = MatriculaNaoValidadas[randomIndex];

    return res.status(200).json({ matriculaAleatoria });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Erro interno do servidor" });
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

//get matricula aleatoria
router.get("/aleatoria/battle/", async (req, res, next) => {
  const { userId } = req.user;
  try {
    // Buscar uma matrícula não validada aleatória
    const matriculaAleatoria = await Matricula.findOne({
      validada: false /* || null*/,
    }).skip(
      Math.floor(
        Math.random() *
          (await Matricula.countDocuments({ validada: false /*|| null */ }))
      )
    );

    // Verifique se há uma matrícula não validada
    if (!matriculaAleatoria) {
      return res
        .status(404)
        .json({ msg: "Nenhuma matrícula não validada encontrada." });
    }

    const existeMatricula = await Users.find({
      _id: userId,
      $or: [
        { matricula_atual: { $exists: true } },
        { matricula_atual: { $ne: null } },
      ],
    });

    if (existeMatricula && existeMatricula.length > 0) {
      return res.status(200).json({
        matricula_atual: existeMatricula.matricula_atual,
        msg: "Finalize essa matrícula antes de solicitar uma nova.",
      });
    } else {
      const setMatricula = await Users.findByIdAndUpdate(userId, {
        $set: { matricula_atual: matriculaAleatoria.codigo },
      });

      if (setMatricula !== null) {
        return res.status(200).json(matriculaAleatoria);
      } else {
        return res
          .status(500)
          .json({ msg: "Não foi possível definir matrícula atual 2" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Erro interno do servidor" });
  }
});

//Get all Matricula
router.delete("/", async (req, res, next) => {
  try {
    const Matricula = await Matricula.deleteMany();
    return res.status(200).json(Matricula);
  } catch (error) {
    next(error);
  }
});
export default router;
