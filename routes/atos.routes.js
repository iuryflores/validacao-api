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
router.get("/validados/matricula/:matricula", async (req, res, next) => {
  const { matricula } = req.params;

  const findedMatricula = await Matricula.findOne({ codigo: matricula });

  try {
    const findedAtos = await Atos.find({
      matriculaCodigo: findedMatricula.codigo,
      validado: true,
    }).sort({ ato: 1 });

    return res.status(200).json(findedAtos);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get("/nao-validados/matricula/:matricula", async (req, res, next) => {
  const { matricula } = req.params;

  const findedMatricula = await Matricula.findOne({ codigo: matricula });

  try {
    const atosNaoValidados = await Atos.find({
      matriculaCodigo: findedMatricula.codigo,
      validado: false,
    }).sort({ ato: 1 });
    return res.status(200).json(atosNaoValidados);
  } catch (error) {
    next(error);
  }
});
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
router.get("/atos-validados/:userName", async (req, res, next) => {
  const { userName } = req.params;

  try {
    const atosValidados = await Atos.find({ userName: userName });
    return res.status(200).json(atosValidados);
  } catch (error) {
    console.log(error);
  }
});
router.get("/validados/geral", async (req, res, next) => {
  try {
    const atosValidados = await Atos.find();
    return res.status(200).json(atosValidados);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ msg: error });
  }
});
router.get("/validados/filtrados/:inicio/:fim", async (req, res, next) => {
  const { inicio, fim } = req.params;

  try {
    // Extrai as datas de início e fim dos parâmetros da requisição
    const startDate = new Date(inicio);
    const endDate = new Date(fim);

    // Adiciona a data de início e fim como critérios de filtragem
    const matchCriteria = {
      createdAt: {
        $gte: startDate, // Atos criados a partir da data de início
        $lte: endDate, // Atos criados até a data de fim
      },
    };

    const atosByHouse = await Atos.aggregate([
      {
        $match: matchCriteria, // Aplica o filtro por data de início e fim
      },
      {
        $lookup: {
          from: "users", // Nome da coleção
          localField: "userName", // Campo do modelo Atos
          foreignField: "full_name", // Campo do modelo Users
          as: "userDetails",
        },
      },
      {
        $group: {
          _id: "$userDetails.house", // Agrupar pela casa
          count: { $sum: 1 }, // Contar a quantidade de atos
        },
      },
    ]);

    // Formatando o resultado para um objeto mais legível
    const result = {};
    atosByHouse.map((item) => {
      const house = item._id[0]; // A casa será o primeiro item do array
      const count = item.count;
      result[house] = count;
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Ocorreu um erro ao buscar a quantidade de atos por casa.",
    });
  }
});
router.get("/validados/ranking", async (req, res, next) => {
  try {
    const atosByHouse = await Atos.aggregate([
      {
        $lookup: {
          from: "users", // Nome da coleção
          localField: "userName", // Campo do modelo Atos
          foreignField: "full_name", // Campo do modelo Users
          as: "userDetails",
        },
      },
      {
        $group: {
          _id: "$userDetails.house", // Agrupar pela casa
          count: { $sum: 1 }, // Contar a quantidade de atos
        },
      },
    ]);

    // Formatando o resultado para um objeto mais legível
    const result = {};
    atosByHouse.map((item) => {
      const house = item._id[0]; // A casa será o primeiro item do array
      const count = item.count;
      result[house] = count;
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Ocorreu um erro ao buscar a quantidade de atos por casa.",
    });
  }
});

router.post("/validar/", async (req, res, next) => {
  const { selectedAtos, matricula, userData } = req.body;
  console.log(selectedAtos);
  console.log(matricula);

  try {
    for (const ato of selectedAtos) {
      const findAto = await Atos.findOne({
        matriculaCodigo: matricula.codigo,
        ato: ato,
      });
      if (!findAto) {
        return res.status(404).json({ msg: `Ato ${ato} não encontrado!` });
      }
      const { _id } = findAto;

      console.log(_id);
      const validarAto = await Atos.findByIdAndUpdate(_id, {
        $set: {
          validado: true,
          user_id: userData._id,
          userName: userData.full_name,
        },
      });
      console.log(validarAto);
    }
    console.log("Ato validado");
    return res.status(201).json({ msg: "Ato validado com sucesso" });
  } catch (error) {
    console.error("Erro ao validar atos:", error);
    res.status(500).json({ msg: "Erro ao validar atos" });
  }
});

export default router;
