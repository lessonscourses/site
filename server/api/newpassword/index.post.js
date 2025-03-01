import bcrypt from "bcrypt";
import UserModel from "~/server/models/User";
import UserDataModel from "~/server/models/UserData";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.restore_password || !body.newPassword || !body.confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Missing required fields",
    });
  }

  // Находим пользователя по _id
  const user_restore = await UserDataModel.findOne({
    restore_password: body.restore_password,
  });
  const user = await UserModel.findOne({ _id: user_restore.id_user });
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "User not found",
    });
  }

  // Проверяем, совпадает ли старый пароль с текущим паролем пользователя
  // const passwordMatch = await bcrypt.compare(body.oldPassword, user.password);
  // if (!passwordMatch) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: "Unauthorized",
  //     message: "Old password is incorrect",
  //   });
  // }

  // Хешируем новый пароль
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(body.newPassword, salt);

  // Обновляем пароль пользователя в базе данных
  await UserModel.findByIdAndUpdate(user._id, { password: hashedNewPassword });
  await UserDataModel.findOneAndUpdate(
    { restore_password: body.restore_password }, // Условие выборки
    { $set: { restore_password: "" } }, // Обновление поля restore_password
    { new: true } // Опция new: true гарантирует, что вернется обновленный документ
  );
  // Возвращаем сообщение об успешном изменении пароля
  return { message: "Password updated successfully" };
});
