import { Router } from "express";

import AtoAsgard from "../models/AtoAsgard.model.js";
import IndicadorReal from "../models/IndicadorReal.model.js";
import UserAsgard from "../models/UserAsgard.model.js";
import Users from "../models/Users.model.js";

import {
  connectDB,
  disconnectDB,
  getPostgresClient,
} from "../config/db.config_postgree.js";

const router = Router();

const transformarDadosAto = (dados) => {
  return dados;
};

const transformarDadosMatricula = (dados) => {
  return dados;
};

const transformDadosUsuario = (dados) => {
  return dados;
};

router.get("/atualizar-mongo", async (req, res) => {
  try {
    await connectDB();

    const postgresClient = getPostgresClient();

    await AtoAsgard.deleteMany({});
    await IndicadorReal.deleteMany({});
    await UserAsgard.deleteMany({});

    const queryAto = "SELECT * FROM ato";
    const resultAto = await postgresClient.query(queryAto);
    const dadosDaAto = resultAto.rows;

    const queryMatricula = "SELECT * FROM indicadorreal";
    const resultMatricula = await postgresClient.query(queryMatricula);
    const dadosDaMatricula = resultMatricula.rows;

    const queryUsuario = "SELECT * FROM usuario";
    const resultUsuario = await postgresClient.query(queryUsuario);
    const dadosDoUsuario = resultUsuario.rows;

    const atosTransformados = transformarDadosAto(dadosDaAto);
    await AtoAsgard.create(atosTransformados);

    const matriculasTranformadas = transformarDadosMatricula(dadosDaMatricula);
    await IndicadorReal.create(matriculasTranformadas);

    const usuariosTranformados = transformDadosUsuario(dadosDoUsuario);
    await UserAsgard.create(usuariosTranformados);

    console.log("Dados inseridos no MongoDB com sucesso!");
    return res
      .status(200)
      .json({ msg: "Dados atualizados no MongoDB com sucesso!" });
  } catch (error) {
    console.error(error);
    await disconnectDB();
    return res.status(500).json({ msg: "Erro ao atualizar dados no MongoDB." });
  } finally {
    await disconnectDB();
  }
});
router.post("/adicionar-iduserasgard", async (req, res) => {
  try {
    // Obtenha todos os usuários do modelo Users
    const usuarios = await Users.find({}, "login");
    // Itere sobre cada usuário
    for (let i = 0; i < usuarios.length; i++) {
      // Use Object.assign para garantir que você está trabalhando com uma cópia do objeto
      const usuario = usuarios[i];

      // Verifique se o campo login está presente e não é nulo ou indefinido
      if (!usuario) {
        console.log(`Usuário ${i + 1} não tem um login válido. Pulando.`);
        continue;
      }

      const usuarioAsgard = await UserAsgard.findOne({
        login: usuario["login"],
      });
      console.log("usuárioAsgar", usuarioAsgard);

      if (usuarioAsgard) {
        // Atualize o campo iduserasgard no modelo Users
        usuario.iduserasgard = usuarioAsgard._id;

        // Salve as alterações
        await usuario.save();
      }
    }

    res.status(200).json({
      mensagem: "IDs de UsuarioAsgard adicionados com sucesso aos usuários",
    });
  } catch (error) {
    console.error(
      "Erro ao adicionar IDs de UsuarioAsgard aos usuários:",
      error
    );
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

export default router;
