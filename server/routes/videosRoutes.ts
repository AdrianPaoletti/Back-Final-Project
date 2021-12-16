import express from "express";
import {
  getVideos,
  getVideoById,
  createVideo,
  deleteVideo,
  updateVideo,
  addFavourite,
  getFavourite,
  getMyVideos,
  getVideosByCategory,
  deleteFavourite,
} from "../controller/videosController";
import checkVideoUser from "../middlewares/checkVideoUser";

const router = express.Router();

router.get("/", getVideos);
router.get("/category/:section", getVideosByCategory);
router.get("/detail/:idVideo", getVideoById);
router.post("/myvideos/create", createVideo);
router.get("/myvideos/created", getMyVideos);
router.get("/myvideos/favourite", getFavourite);
router.delete("/myvideos/delete/:idVideo", checkVideoUser, deleteVideo);
router.put("/myvideos/update/:idVideo", checkVideoUser, updateVideo);
router.patch("/favourite/:idVideo", addFavourite);
router.patch("/myvideos/favourite/delete/:idVideo", deleteFavourite);

export default router;
