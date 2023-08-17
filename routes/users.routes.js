import { Router } from "express";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

//Create User
router.post("/user/auth/signup", async (req, res, next) => {
  const { body } = req;

  //Get data from body
  let { full_name, email, password } = req.body;

  //Check if all fields are filled
  if (!full_name || !email || !password) {
    return res.status(400).json({ msg: "All fields are required!" });
  }

  //Check if is a valid email
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Your email is not a valid one." });
  }

  try {
    //Check if user exists
    const foundedUser = await User.findOne({ email });
    if (foundedUser) {
      return res.status(400).json({
        msg: `A user with this email '${foundedUser.email}' already exists!`,
      });
    }

    //Generate passwordHash
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    //Create new user
    const newUser = await User.create({ full_name, email, passwordHash });

    //Get id from newUser
    const { _id } = newUser;

    res.status(201).json({ full_name, email, _id });
  } catch (error) {
    next(error);
  }
});

//Login
router.post("/user/auth/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //Look for user by email
    const user = await User.findOne({ email });

    //Check if email was founded
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
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
