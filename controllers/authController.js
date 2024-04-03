import JWT from "jsonwebtoken";
import prisma from "../prisma/Prisma.js";
import { comparePassword, hashPassword } from "../utils/authHelper.js";
import { getUserByEmail } from "../prisma/db-operations.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validation
    if (!username) {
      return res.send({ message: "Username is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }

    const existinguser = await getUserByEmail(email);

    // existing user
    if (existinguser) {
      return res.status(200).send({
        success: false,
        message: "Already Regsiter please login",
      });
    }
    // register user
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).send({
      success: true,
      message: "User register Successully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register",
      error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Email or password is missing",
      });
    }

    // check user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not register",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const payload = {
      userId: user.id,
    };
    console.log(payload);
    // Token
    const token = JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
  }
};
