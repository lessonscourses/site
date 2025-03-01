import bcrypt from "bcrypt";
import User from "~/server/models/User";
import UserData from "~/server/models/UserData";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.email || !body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Missing required fields",
    });
  }

  // Проверка существования пользователя с таким email
  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "Conflict",
      message: "User with this email already exists",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(body.password, salt);

  // Создание пользователя
  const user = await User.create({ ...body, password: hashedPassword });

  // Создание данных пользователя
  const formattedDate = new Date().toISOString();
  const userData = {
    id_user: user._id,
    date_registration: formattedDate,
    activation_date: "",
    activation_get: body.getparams,
    status: false,
    blocking: false,
    verification: false,
  };
  const userdata = await UserData.create(userData);

  // Возвращение результатов
  return { ...user.toObject(), password: undefined };
});
