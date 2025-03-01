import bcrypt from "bcrypt";
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (
    !body.id_user ||
    !body.oldPassword ||
    !body.newPassword ||
    !body.confirmPassword
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Missing required fields",
    });
  }

  // Находим пользователя по _id
  const user = await User.findOne({ _id: body.id_user });
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "User not found",
    });
  }

  // Проверяем, совпадает ли старый пароль с текущим паролем пользователя
  const passwordMatch = await bcrypt.compare(body.oldPassword, user.password);
  if (!passwordMatch) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Old password is incorrect",
    });
  }

  // Хешируем новый пароль
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(body.newPassword, salt);

  // Обновляем пароль пользователя в базе данных
  await User.findByIdAndUpdate(user._id, { password: hashedNewPassword });

  // Возвращаем сообщение об успешном изменении пароля
  return { message: "Password updated successfully" };
});
