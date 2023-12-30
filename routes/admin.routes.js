import { Router } from "express";
import Atos from "../models/Atos.model.js";
import Matricula from "../models/Matricula.model.js";

const router = Router();
router.get("/atualizar/", async (req, res, next) => {
  console.log("Atualizar rotas");
  return res.status(200).json({ msg: "Working!" });
});

router.put("/atualizar/atos/", async (req, res, next) => {
  try {
    const validados = await Atos.updateMany(
      { nome: { $exists: true } },
      { $set: { validado: true } }
    );

    const naoValidados = await Atos.updateMany(
      { nome: { $exists: false } },
      { $set: { validado: false } }
    );
    const updateCount = validados.modifiedCount + naoValidados.modifiedCount;
    return res
      .status(201)
      .json({ msg: "Atos validados e não validados atualizados", updateCount });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
