import { Router } from "express";
import User from "../models/Users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// Função para gerar um token JWT
const generateJwtToken = (userId) => {
  const expirationTimeInSeconds = 3600; // Tempo de expiração em segundos (por exemplo, 1 hora)
  const expirationTimestamp =
    Math.floor(Date.now() / 1000) + expirationTimeInSeconds;

  // Gere o token JWT
  const token = jwt.sign(
    { userId, exp: expirationTimestamp },
    process.env.JWT_SECRET
  );

  return {
    token,
    expirationTimestamp,
  };
};

//Create User
router.post("/user/auth/signup", async (req, res, next) => {
  let { newUsername, confirmPassword, departament, house, newEmail } = req.body;

  console.log(req.body);
  try {
    //Get data from body

    //Check if all fields are filled
    if (
      !newUsername ||
      !confirmPassword ||
      !departament ||
      !house ||
      !newEmail
    ) {
      return res.status(400).json({ msg: "Todos os campos são obrigatórios!" });
    }

    const email = newEmail + "@1rigo.com";

    //Check if user exists
    const foundedUser = await User.findOne({ email });
    if (foundedUser) {
      return res.status(400).json({
        msg: `Já existe um usuário com esse email: '${foundedUser.email}'@1rigo.com!`,
      });
    }

    //Generate passwordHash
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(confirmPassword, salt);

    //Create new user
    const newUser = await User.create({
      full_name: newUsername,
      departament,
      house,
      email,
      passwordHash,
    });

    //Get id from newUser
    const { _id } = newUser;

    res.status(201).json({ newUsername, departament, house, _id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Login
router.post("/user/auth/login", async (req, res, next) => {
  const { email, password } = req.body;

  const LoginEmail = email + "@1rigo.com";

  try {
    //Look for user by email
    const user = await User.findOne({ email: LoginEmail, status: true });

    //Check if email was founded
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado/ativado!" });
    }

    //Compare the password if matchs
    const compareHash = bcrypt.compareSync(password, user.passwordHash);

    //Check if the password is wrong
    if (!compareHash) {
      return res.status(400).json({ msg: "Wrong email or password." });
    }

    //Create payload
    const payload = { id: user._id, email: user.email };

    const userId = user._id;

    // Create token
    const { token, expirationTimestamp } = generateJwtToken(user._id);
    console.log(token);
    console.log(expirationTimestamp);
    res.status(200).json({ token, expirationTimestamp, userId });

    //Create token
    /* const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });*/

    /* res.status(200).json({ ...payload, token });*/
  } catch (error) {
    next(error);
  }
});

export default router;
