import { Schema, model, ObjectId } from "mongoose";

export interface IComment {
  date: Date;
  text: string;
  likes: number;
  dislikes: number;
  user: ObjectId;
  avatar: ObjectId;
  video: ObjectId;
}

const commentSchema: Schema<IComment> = new Schema({
  date: {
    type: Date,
    required: true,
  },
  text: {
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
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  avatar: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
  },
});

const Comment = model("Comment", commentSchema, "comments");

export default Comment;