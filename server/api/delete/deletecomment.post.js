import CommentModel from "~/server/models/Comment";

export default defineEventHandler(async (event) => {
  try {
    const { commentId, userId } = await readBody(event);

    if (!commentId || !userId) {
      return { error: "Некорректные данные" };
    }

    // Ищем комментарий
    const comment = await CommentModel.findOne({ _id: commentId });

    if (!comment) {
      return { error: "Комментарий не найден" };
    }

    // Проверяем, принадлежит ли комментарий пользователю
    if (comment.id_user.toString() !== userId) {
      return { error: "Вы не можете удалить этот комментарий" };
    }

    // Удаляем комментарий
    await CommentModel.deleteOne({ _id: commentId });

    return { success: true };
  } catch (err) {
    console.error("Ошибка при удалении комментария:", err);
    return { error: "Ошибка сервера" };
  }
});
