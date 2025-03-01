import FilterModel from "~/server/models/Filter";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    //const obj = { category: data.FilterCat };
    const result = await FilterModel.find().select("-_id");
    return result;
  } catch (err) {
    console.log(err);
  }
});
