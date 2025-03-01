import CommentModel from "~/server/models/Comment";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event); // Получаем тело запроса
    const { text, userId, userName, kirilica } = data; // Извлекаем данные

    // Проверяем, авторизован ли пользователь
    if (!userId || !userName) {
      return {
        error: "Вы должны быть авторизованы для добавления комментариев!",
      };
    }
    // Проверяем, сколько комментариев оставил пользователь для данного курса (по полю kirilica)
    const existingCommentsCount = await CommentModel.countDocuments({
      id_user: userId,
      kirilica: kirilica, // Проверяем комментарии для конкретного курса по полю kirilica
    });
    // Если пользователь оставил 3 или более комментариев, выводим ошибку
    if (existingCommentsCount >= 3) {
      return {
        error: "Вы не можете оставить более 3 комментариев на этот курс!",
      };
    }

    // Добавляем комментарий в БД
    const comment = await CommentModel.create({
      text,
      id_user: userId, // Используем id пользователя
      userName, // Используем имя пользователя
      kirilica, // Используем поле kirilica вместо id_course
    });

    return comment;
  } catch (err) {
    console.error("Ошибка при добавлении комментария:", err);
    return { error: "Ошибка сервера" };
  }
});
