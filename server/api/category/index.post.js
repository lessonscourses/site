import CategoryModel from "~/server/models/Category";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await CategoryModel.find({ show_catalog: true })
        .select("-_id")
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await CategoryModel.find({ show_catalog: true })
        .select("-_id")
        .count();
      return { result, count };
    } else {
      const result = await CategoryModel.find({ show_catalog: true }).select(
        "-_id"
      );
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
