import { Schema, model, Types } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  password: string;
  avatar?: string;
  favouriteVideos: Array<string>;
  myVideos: Array<string>;
}

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png",
  },
  favouriteVideos: {
    type: [Types.ObjectId],
    ref: "Video",
  },
  myVideos: {
    type: [Types.ObjectId],
    ref: "Video",
  },
});

const User = model("User", userSchema, "users");

export default User;