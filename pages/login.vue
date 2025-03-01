<script setup>
import { object, string, ref as yupRef } from "yup";
import { configure } from "vee-validate";

definePageMeta({
  middleware: "guest",
  layout: "default",
});

const { signIn } = useAuth();

const form = {
  email: "",
  password: "",
};

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: true,
  validateOnModelUpdate: true,
});

const handleLogin = async (value) => {
  console.log(value);
  const res = await signIn("credentials", { redirect: false, ...value });
  if (res.error) {
    // Обработка ошибки аутентификации
    console.log("Ошибка аутентификации:", res.error);
    if (res.error == "UnautorizedEmail") {
      openErrorEmail();
    } else if (res.error == "UnautorizedPassword") {
      openErrorPassword();
    }
  } else {
    // Если ошибки нет, перенаправляем пользователя на страницу "cabinet"
    useRouter().push({
      name: "cabinet",
    });
  }
};

const schema = object({
  email: string()
    .required("Введите Ваш email")
    .email("Введите корректный email адрес"),
  password: string()
    .required("Введите текущий пароль")
    .min(5, "Пароль не должен быть короче 5 символов"),
});
const openErrorPassword = () => {
  ElNotification({
    title: "Error",
    message: "Пароль введён не верно",
    type: "error",
    position: "bottom-left",
    duration: 6000,
  });
};
const openErrorEmail = () => {
  ElNotification({
    title: "Error",
    message: "Email введён не верно",
    type: "error",
    position: "bottom-left",
    duration: 6000,
  });
};
</script>
<template>
  <div>
    <div class="bd-docs-main">
      <div class="container is-max-desktop">
        <div class="content">
          <h1 class="h1-info">Вход</h1>

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
                  <CabinetVTextInput
                    type="password"
                    name="password"
                    label="Пароль"
                    placeholder="Введите пароль"
                    leftIcon="solar:lock-keyhole-unlocked-broken"
                  />

                  <button class="button is-success" type="submit">Войти</button>
                </VeeForm>
                <div class="info-reg">
                  <span>Забыли пароль</span>
                  <nuxt-link to="/restore" class="button is-success is-light"
                    >Восстановить</nuxt-link
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
