import UserModel from "~/server/models/User";
import UserDataModel from "~/server/models/UserData";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    // Получаем данные из запроса
    const { email, restore_password } = data;

    // Создаем объект для поиска пользовательских данных по email
    const userObj = { email };

    // Найти пользователя по email
    const userUpdateResult = await UserModel.findOneAndUpdate(userObj, {
      email,
    });

    // Проверить, был ли найден пользователь
    if (!userUpdateResult) {
      throw new Error("Пользователь с таким email не найден");
    } else {
      // Обновляем параметры status и activation_date в userData
      const userDataObj = { id_user: userUpdateResult._id };
      const userDataUpdateResult = await UserDataModel.updateOne(userDataObj, {
        restore_password,
      });
    }

    // Возвращаем результат обновления
    return userUpdateResult;
  } catch (err) {
    console.error(err);
    throw err; // Пробрасываем ошибку дальше для обработки в вызывающем коде
  }
});
