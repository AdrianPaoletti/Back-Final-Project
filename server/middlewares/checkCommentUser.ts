import express from "express";
import Comment from "../../database/model/comment";
import { RequestAuth } from "../../interfaces/auth/auth";

class ErrorCode extends Error {
  code: number | undefined;
}

const checkCommentUser = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  const { idComment } = req.params;
  try {
    const comment = await Comment.findById(idComment);
    if (comment.user.toString() === req.userId) {
      next();
      return;
    }
    const error = new ErrorCode("User not allowed");
    error.code = 401;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Can not find the comment";
    next(error);
  }
};

export default checkCommentUser;
