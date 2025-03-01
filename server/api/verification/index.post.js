import UserDataModel from "~/server/models/UserData";

export default defineEventHandler(async (event) => {
  try {
    // Получаем данные из запроса
    const data = await readBody(event);

    // Извлекаем id_user и обновляемые параметры
    const { activation_get, verification } = data;

    // Создаем объект для поиска пользовательских данных по id_user
    const userDataObj = { activation_get };

    // Обновляем параметры status и activation_date в userData
    const userDataUpdateResult = await UserDataModel.updateOne(userDataObj, {
      verification,
    });

    // Возвращаем результат обновления
    return userDataUpdateResult;
  } catch (err) {
    console.log(err);
    throw err; // Пробрасываем ошибку дальше для обработки в вызывающем коде
  }
});
