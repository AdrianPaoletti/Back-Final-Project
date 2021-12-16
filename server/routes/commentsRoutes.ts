import express from "express";
import {
  createComment,
  deleteComment,
  updateComment,
  getComment,
} from "../controller/commentsController";
import checkCommentUser from "../middlewares/checkCommentUser";

const router = express.Router();

router.get("/get/:idComment", getComment)
router.post("/create/:idVideo", createComment);
router.put("/update/:idComment", checkCommentUser, updateComment);
router.delete("/delete/:idVideo/:idComment", checkCommentUser, deleteComment);

export default router;