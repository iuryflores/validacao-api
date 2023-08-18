import { Router } from "express";
import User from "../models/Users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

//Create User
router.post("/user/auth/signup", async (req, res, next) => {
  let { newUsername, confirmPassword, departament, house } = req.body;
  try {
    //Get data from body

    //Check if all fields are filled
    if (!newUsername || !confirmPassword || !departament || !house) {
      return res.status(400).json({ msg: "Todos os campos são obrigatórios!" });
    }

    //Check if user exists
    const foundedUser = await User.findOne({ full_name: newUsername });
    if (foundedUser) {
      return res.status(400).json({
        msg: `Já existe um usuário com o nome: '${foundedUser.full_name}'!`,
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
  const { username, password } = req.body;

  try {
    //Look for user by email
    const user = await User.findOne({ full_name: username });

    //Check if email was founded
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    //Compare the password if matchs
    const compareHash = bcrypt.compareSync(password, user.passwordHash);

    //Check if the password is wrong
    if (!compareHash) {
      return res.status(400).json({ msg: "Wrong email or password." });
    }

    //Create payload
    const payload = { id: user._id, email: user.email };

    //Create token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.status(200).json({ ...payload, token });
  } catch (error) {
    next(error);
  }
});

export default router;
