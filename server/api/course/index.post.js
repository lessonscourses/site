import CourseModel from "~/server/models/Courses";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data) {
      const obj = { kirilica: data };
      const result = await CourseModel.find(obj).select("-_id");
      return result;
    } else {
      const result = await CourseModel.find().select("-_id");
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
