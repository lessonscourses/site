<script setup>
import { object, string, ref as yupRef } from "yup";
import { configure } from "vee-validate";

definePageMeta({
  middleware: "guest",
  layout: "default",
});

const randomNumbers = Array.from({ length: 1 }, () =>
  Math.floor(Math.random() * 100000000)
).toString();

const form = {
  username: "Вы",
  email: "",
  restore_password: randomNumbers,
};

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: true,
  validateOnModelUpdate: true,
});

const handleLogin = async (value) => {
  try {
    const response = await $fetch("/api/restorepassword", {
      method: "POST",
      body: { email: value.email, restore_password: randomNumbers },
    });
    if (response) {
      openSuccess();
      mailSend(value);
    } else {
      openErrorEmail();
    }
  } catch (error) {
    console.error("Failed to send restore password request:", error);
    openErrorEmail(); // Вывести ошибку, если произошла ошибка при отправке запроса
  }
};

const schema = object({
  email: string()
    .required("Введите Ваш email")
    .email("Введите корректный email адрес"),
});

const openErrorEmail = () => {
  ElNotification({
    title: "Error",
    message: "Email введён не верно",
    type: "error",
    position: "bottom-left",
    duration: 6000,
  });
};
const openSuccess = () => {
  ElMessageBox.alert(
    "На указанную вами почту был выслано письмо восстановления пароля.",
    "Письмо отправленно",
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
          <h1 class="h1-info">Восстановить пароль</h1>

          <div class="columns">
            <div class="column is-5">
              <div class="login-form">
                <VeeForm
                  :initial-values="form"
                  :validation-schema="schema"
                  @submit="handleLogin"
                >
                  <CabinetVTextInput
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Введите Email"
                    leftIcon="solar:letter-broken"
                  />
                  <button class="button is-success" type="submit">
                    Отправить письмо
                  </button>
                </VeeForm>
                <div class="info-reg">
                  <span>Нет аккаунта</span>
                  <nuxt-link
                    to="/registration"
                    class="button is-success is-light"
                    >Зарегистрироваться</nuxt-link
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
