import express from "express";
import Video from "../../database/model/video";
import Comment from "../../database/model/comment";
import { RequestAuth } from "../../interfaces/auth/auth";

class ErrorCode extends Error {
  code: number | undefined;
}

const getComment = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  try {
    const { idComment } = req.params;
    const comment = await Comment.findById(idComment);
    if (comment) {
      res.json(comment);
      return;
    }
    const error = new ErrorCode("Could not get comment");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "General error on getComment";
    next(error);
  }
};

const createComment = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  try {
    const { idVideo } = req.params;
    const comment = req.body;
    const newComment = await Comment.create({ ...comment, user: req.userId });
    if (newComment) {
      const video = await Video.findOne({ id: idVideo });
      video.comments = [...video.comments, newComment.id];
      video.save();
      res.json(newComment);
      return;
    }
    const error = new ErrorCode("Could not create comment");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Fail on create new comment";
    next(error);
  }
};

const deleteComment = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  try {
    const { idVideo, idComment } = req.params;
    const deletedComment = await Comment.findByIdAndRemove(idComment);
    if (deletedComment) {
      const video = await Video.findOne({ id: idVideo });
      video.comments = video.comments.filter(
        (comment) => comment.toString() !== deletedComment.id.toString()
      );
      video.save();
      res.json("Succesfully deleted");
      return;
    }
    const error = new ErrorCode("Could not find id of comment to remove");
    error.code = 404;
    next(error);
  } catch (error) {
    error.message = "Could not delete comment by id from params";
    error.code = 400;
    next(error);
  }
};

const updateComment = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  try {
    const { idComment } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(
      idComment,
      req.body,
      {
        new: true,
      }
    );
    if (updatedComment) {
      res.json(updatedComment);
      return;
    }
    const error = new ErrorCode("Could not update comment of Video");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Could no get id of comment";
    next(error);
  }
};

export { createComment, deleteComment, updateComment, getComment };
