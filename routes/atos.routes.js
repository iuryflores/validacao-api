import { Router } from "express";
import Atos from "../models/Atos.model.js";
import Matricula from "../models/Matricula.model.js";

const router = Router();

//Get all matriculas
router.get("/validados", async (req, res, next) => {
  try {
    const atosValidados = await Atos.find({ validado: true });
    return res.status(200).json({ atosValidados: atosValidados.length });
  } catch (error) {
    next(error);
  }
});
router.get("/nao-validados", async (req, res, next) => {
  try {
    const atosValidados = await Atos.find({ validado: false });
    return res.status(200).json({ atosNaoValidados: atosValidados.length });
  } catch (error) {
    next(error);
  }
});

router.get("/nao-validados/matricula/:matricula", async (req, res, next) => {
  const { matricula } = req.params;

  const findedMatricula = await Matricula.findById(matricula);

  const matchMatricula = await Atos.findOne({
    matriculaCodigo: findedMatricula.codigo,
  });

  try {
    const atosValidados = await Atos.find({
      matriculaCodigo: matchMatricula.matriculaCodigo,
    });
    return res.status(200).json({ atosValidados });
  } catch (error) {
    next(error);
  }
});
router.get(
  "/nao-validados/matriculaCodigo/:matriculaCodigo",
  async (req, res, next) => {
    const { matriculaCodigo } = req.params;

    try {
      const atosValidados = await Atos.find({
        matriculaCodigo: matriculaCodigo,
      }).sort({ ato: 1 });
      return res.status(200).json(atosValidados);
    } catch (error) {
      next(error);
    }
  }
);
router.post("/", async (req, res, next) => {
  const { body } = req;
  try {
    const validar = await Atos.create({ ...body });

    return res.status(200).json(validar);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  /*
  try {
    const validar = await Atos.find({ validado: false });
    return res.status(200).json(validar);
  } catch (error) {
    next(error);
  }*/
});

export default router;
