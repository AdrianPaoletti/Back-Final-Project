import express from "express";
import Video from "../../database/model/video";
import { RequestAuth } from "../../interfaces/auth/auth"

class ErrorCode extends Error {
  code: number | undefined;
}

const checkVideoUser = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  const { idVideo } = req.params;
  try {
    const video = await Video.findById(idVideo);
    if ((video.user).toString() === req.userId) {
      next();
      return;
    }
    const error = new ErrorCode("User not allowed");
    error.code = 401;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Can not find the video";
    next(error);
  }
};

export default checkVideoUser;