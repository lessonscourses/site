import FilterModel from "~/server/models/Filter";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await FilterModel.find()
        .select("-_id")
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await FilterModel.find().select("-_id").count();
      return { result, count };
    } else {
      const result = await FilterModel.find().select("-_id");
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
