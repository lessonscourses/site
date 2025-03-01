import ChildCategoryModel from "~/server/models/ChildCategory";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await ChildCategoryModel.find({ show_catalog: true })
        .select("-_id")
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await ChildCategoryModel.find({
        show_catalog: true,
      })
        .select("-_id")
        .count();
      return { result, count };
    } else {
      const result = await ChildCategoryModel.find({
        show_catalog: true,
      }).select("-_id");
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
