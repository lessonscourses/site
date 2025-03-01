import CourseModel from "~/server/models/Courses";

export default defineEventHandler(async (event) => {
  try {
    const result = await CourseModel.find({ show_top: true });
    return result;
  } catch (err) {
    console.log(err);
  }
});
