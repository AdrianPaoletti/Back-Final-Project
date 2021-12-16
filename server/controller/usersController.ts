import dotenv from "dotenv";

dotenv.config();
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/model/user";
import { RequestAuth } from "../../interfaces/auth/auth";

class ErrorCode extends Error {
  code: number | undefined;
}

const registerUser = async (req, res: express.Response, next: any) => {
  let fileUrl;
  try {
    const user = req.body;
    const { username } = req.body;
    if (req.file) {
      fileUrl = req.file.fileURL;
    }
    const userCheck = await User.findOne({ username });
    if (userCheck !== null) {
      const error = new ErrorCode("Username already exists, please change it");
      error.code = 404;
      next(error);
    } else {
      const userHashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await User.create({
        ...user,
        password: userHashedPassword,
        avatar: fileUrl,
      });
      if (newUser) {
        res.json(newUser);
      } else {
        const error = new ErrorCode("Not possible to create a new user");
        error.code = 404;
        next(error);
      }
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const loginUser = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      const error = new ErrorCode("Incorrect username");
      error.code = 401;
      next(error);
    } else {
      const rightPassword = await bcrypt.compare(password, user.password);
      if (!rightPassword) {
        const error = new ErrorCode("Incorrect password");
        error.code = 401;
        next(error);
      } else {
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            password: user.password,
          },
          process.env.SECRET
        );
        res.json({ token });
      }
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const getUser = async (req: RequestAuth, res: express.Response, next: any) => {
  try {
    const userSearched = await User.findById(req.userId);
    if (userSearched) {
      res.json(userSearched);
      return;
    }
    const error = new ErrorCode("Could not find the id of user");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Could not get user";
    next(error);
  }
};

const updateUser = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  // let fileUrl;
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    if (req.file) {
      req.body.avatar = req.file.fileURL;
    }
    const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    });
    if (updatedUser) {
      res.json(updatedUser);
      return;
    }
    const error = new ErrorCode("Could not update");
    error.code = 404;
    next(error);
    return;
  } catch (error) {
    error.code = 400;
    error.message = "General error on update user";
    next(error);
  }
};

const deleteUser = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  try {
    const deletedUser = await User.findByIdAndRemove(req.userId);
    if (deletedUser) {
      res.json("User deleted");
      return;
    }
    const error = new ErrorCode("Could not delete user");
    error.code = 404;
    next(error);
  } catch (error) {
    error.message = "Could not get id from user";
    error.code = 400;
    next(error);
  }
};
export { registerUser, loginUser, updateUser, deleteUser, getUser };
