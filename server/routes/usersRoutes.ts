import express from "express";
import { validate } from "express-validation";
import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
} from "../controller/usersController";
import firebase from "../middlewares/firebase";
import upload from "../middlewares/upload";
import { loginSchema, registerSchema } from "../schemas/userSchema";
import Auth from "../middlewares/auth";

const router = express.Router();

router.post(
  "/register",
  upload.single("avatar"),
  firebase,
  validate(registerSchema),
  registerUser
);
router.post("/login", validate(loginSchema), loginUser);
router.put("/update", Auth, upload.single("avatar"), firebase, updateUser);
router.delete("/delete", Auth, deleteUser);
router.get("/get", Auth, getUser);

export default router;
