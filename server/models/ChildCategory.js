import mongoose from "mongoose";

const childCategoryScema = new mongoose.Schema({
  category: { type: String, require: true, trim: true },
  name: { type: String, require: true, trim: true },
  kirilica: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
  icon: { type: String, require: true, trim: true },
  description: { type: String, require: true, trim: true },
});

const ChildCategoryModel = mongoose.model("childcategory", childCategoryScema);

export default ChildCategoryModel;
