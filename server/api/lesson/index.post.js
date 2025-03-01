import LessonModel from "~/server/models/Lesson";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { course: data.Course };
    const result = await LessonModel.find(obj).select("-_id");
    return result;
  } catch (err) {
    console.log(err);
  }
});
