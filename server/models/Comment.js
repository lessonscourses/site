import mongoose from "mongoose";

const commentScema = new mongoose.Schema({
  id_course: { type: Number, require: true, trim: true },
  id_user: { type: String, require: true, trim: true },
  kirilica: { type: String, require: true, trim: true },
  date: { type: String, require: true, trim: true },
  userName: { type: String, require: true, trim: true },
  text: { type: String, require: true, trim: true },
});

const CommentModel = mongoose.model("comment", commentScema);

export default CommentModel;
