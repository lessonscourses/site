<script setup>
import { object, string, ref as yupRef } from "yup";
import { configure } from "vee-validate";
definePageMeta({
  middleware: "guest",
});

const randomNumbers = Array.from({ length: 1 }, () =>
  Math.floor(Math.random() * 100000000)
).toString();

const form = {
  username: "",
  email: "",
  password: "",
  getparams: randomNumbers,
};

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: true,
  validateOnModelUpdate: true,
});

const handleFromSubmit = async (value) => {
  try {
    const response = await $fetch("/api/auth/registr", {
      method: "POST",
      body: value,
    });
    // Проверяем успешность запроса
    if (response) {
      // Если успешно, перенаправляем пользователя на страницу входа
      openSuccess();
      //useRouter().push({ name: "login" });
      mailSend(value);
    } else {
      // Если есть ошибки в запросе, выводим сообщение об ошибке
      console.error("Ошибка регистрации:", response);
      // Здесь можно использовать сообщение об ошибке в удобном для вас формате,
    }
  } catch (err) {
    openErrorEmail();
    console.error("Ошибка при отправке запроса регистрации:", err);
  }
};
const schema = object({
  username: string()
    .required("Введите Ваше имя")
    .min(3, "Имя не должен быть короче 3 символов"),
  email: string()
    .required("Введите Ваш email")
    .email("Введите корректный email адрес"),
  password: string()
    .required("Введите текущий пароль")
    .min(5, "Пароль не должен быть короче 5 символов"),
});
const openErrorEmail = () => {
  ElNotification({
    title: "Error",
    message: "Email уже существует",
    type: "error",
    position: "bottom-left",
    duration: 6000,
  });
};

const openSuccess = () => {
  ElMessageBox.alert(
    "На указанную вами почту был выслан ссылка верификации.",
    "Вы зарегистрировались",
    {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: "Войти",
      callback: (action) => {
        useRouter().push({ name: "login" });
      },
    }
  );
};
const mailSend = async (value) => {
  const responseData = await $fetch("/api/mailsend/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: value,
  });
};
</script>
<template>
  <div>
    <div class="bd-docs-main">
      <div class="container is-max-desktop">
        <div class="content">
          <h1 class="h1-info">Регистрация</h1>
          <div class="columns">
            <div class="column is-5">
              <div class="login-form">
                <VeeForm
                  :initial-values="form"
                  :validation-schema="schema"
                  @submit="handleFromSubmit"
                >
                  <CabinetVTextInput
                    type="text"
                    name="username"
                    label="Имя"
                    placeholder="Введите Ваше Имя"
                    leftIcon="solar:user-rounded-broken"
                  />
                  <CabinetVTextInput
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Введите Email"
                    leftIcon="solar:letter-broken"
                  />
                  <CabinetVTextInput
                    type="password"
                    name="password"
                    label="Пароль"
                    placeholder="Введите пароль"
                    leftIcon="solar:lock-keyhole-unlocked-broken"
                  />

                  <button class="button is-success" type="submit">
                    Зарегистрироваться
                  </button>
                </VeeForm>
                <div class="info-reg">
                  <span>Есть аккаунт</span>
                  <nuxt-link to="/login" class="button is-success is-light"
                    >Войти</nuxt-link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
