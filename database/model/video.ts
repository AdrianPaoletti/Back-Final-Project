import { Schema, model, Types, ObjectId } from "mongoose";

interface IVideo {
  url: string;
  title: string;
  date: Date;
  category: string;
  description: string;
  likes: number;
  dislikes: number;
  views: number;
  user: ObjectId;
  comments: Array<string>;
}

const videoSchema: Schema<IVideo> = new Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: {
    type: [Types.ObjectId],
    ref: "Comment",
  },
});

const Video = model("Video", videoSchema, "videos");

export default Video;