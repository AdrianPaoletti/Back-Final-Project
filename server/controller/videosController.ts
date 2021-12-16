/* eslint-disable no-underscore-dangle */
import express from "express";
import Video from "../../database/model/video";
import User from "../../database/model/user";
import { RequestAuth } from "../../interfaces/auth/auth";

class ErrorCode extends Error {
  code: number | undefined;
}

const getVideos = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  try {
    const videos = await Video.find().populate({
      path: "user",
      select: "username avatar",
    });
    if (videos) {
      res.json(videos);
      return;
    }
    const error = new ErrorCode("Could not find videos");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "General error on getting videos";
    next(error);
  }
};

const getVideoById = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  try {
    const { idVideo } = req.params;
    const searchedVideo = await Video.findById(idVideo)
      .populate({
        path: "user",
        select: "username avatar",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username avatar",
        },
      });

    if (searchedVideo) {
      res.json(searchedVideo);
      return;
    }
    const error = new ErrorCode("Could not find the id of the video");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Could not get id from params";
    next(error);
  }
};

const getMyVideos = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "myVideos",
      populate: {
        path: "user",
        select: "username avatar",
      },
    });
    if (user) {
      res.json(user.myVideos);
      return;
    }
    const error = new ErrorCode("Could not populate myVideos");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Could not get user to populate";
    next(error);
  }
};

const getFavourite = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "favouriteVideos",
      populate: {
        path: "user",
        select: "username avatar",
      },
    });
    if (user) {
      res.json(user.favouriteVideos);
      return;
    }
    const error = new ErrorCode("Could not populate favouriteVideos");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Could not get user to populate";
    next(error);
  }
};

const getVideosByCategory = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  try {
    const { section } = req.params;
    const videos = await Video.find({ category: section }).populate({
      path: "user",
      select: "username avatar",
    });
    if (videos) {
      res.json(videos);
      return;
    }
    const error = new ErrorCode("Could not find category");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "General error on getByCategory";
    next(error);
  }
};

const createVideo = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  try {
    const video = req.body;
    const newVideo = await Video.create({ ...video, user: req.userId });
    if (newVideo) {
      const user = await User.findById(req.userId);
      user.myVideos = [...user.myVideos, newVideo.id];
      user.save();
      res.json(newVideo);
      return;
    }
    const error = new ErrorCode("Could not create video");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Fail on create new video";
    next(error);
  }
};

const addFavourite = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  try {
    const { idVideo } = req.params;
    const video = await Video.findById(idVideo);
    if (video) {
      const user = await User.findById(req.userId);
      user.favouriteVideos = [...user.favouriteVideos, video.id];
      user.save();
      res.json("Added!");
      return;
    }
    const error = new ErrorCode("Could not add video to myFavourties");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Could no get id from params to add video";
    next(error);
  }
};

const deleteFavourite = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  try {
    const { idVideo } = req.params;
    const videoGet = await Video.findById(idVideo);
    if (videoGet) {
      const user = await User.findById(req.userId);
      user.favouriteVideos = user.favouriteVideos.filter(
        (video) => video.toString() !== videoGet.id.toString()
      );
      user.save();
      res.json("Removed!");
      return;
    }
    const error = new ErrorCode("Could not add video to myFavourties");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "Could no get id from params to add video";
    next(error);
  }
};

const updateVideo = async (
  req: express.Request,
  res: express.Response,
  next: any
) => {
  try {
    const { idVideo } = req.params;
    const updatedVideo = await Video.findByIdAndUpdate(idVideo, req.body, {
      new: true,
    });
    if (updatedVideo) {
      res.json(updatedVideo);
      return;
    }
    const error = new ErrorCode("Found the video but could not update");
    error.code = 404;
    next(error);
  } catch (error) {
    error.code = 400;
    error.message = "General error on updating the video";
    next(error);
  }
};

const deleteVideo = async (
  req: RequestAuth,
  res: express.Response,
  next: any
) => {
  try {
    const { idVideo } = req.params;
    const deletedVideo = await Video.findByIdAndRemove(idVideo);
    if (deletedVideo) {
      const user = await User.findById(req.userId);
      user.myVideos = user.myVideos.filter(
        (video) => video.toString() !== deletedVideo.id.toString()
      );
      user.save();
      res.json("Deleted successfully");
      return;
    }
    const error = new ErrorCode("Could not find id of video to remove");
    error.code = 404;
    next(error);
  } catch (error) {
    error.message = "Could not get id from params";
    error.code = 400;
    next(error);
  }
};

export {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  addFavourite,
  getMyVideos,
  getFavourite,
  getVideosByCategory,
  deleteFavourite,
};
