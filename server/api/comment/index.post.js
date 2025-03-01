import CommentModel from "~/server/models/Comment";

export default defineEventHandler(async (event) => {
  try {
    const { kirilica } = await readBody(event); // Извлекаем kirilica из запроса
    const result = await CommentModel.find({ kirilica }).lean(); // Ищем комментарии по kirilica
    return result;
  } catch (err) {
    console.log(err);
    return { error: "Ошибка при получении комментариев" };
  }
});
