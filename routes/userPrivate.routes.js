import { Router } from "express";
import User from "../models/Users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    //Look for user by email
    const user = await User.findById(userId);

    //Check if email was founded
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado/ativado!" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
