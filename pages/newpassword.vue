<script setup>
import { object, string, ref as yupRef } from "yup";
import { configure } from "vee-validate";

definePageMeta({
  middleware: "guest",
  layout: "default",
});

const route = useRoute();
const restoreCod = ref("");

if (route.query.cod !== "") {
  restoreCod.value = route.query.cod;
}

const form = {
  newPassword: "",
  confirmPassword: "",
  id_user: "",
  restore_password: restoreCod.value,
};

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: true,
  validateOnModelUpdate: true,
});

const changePassword = async (values, { resetForm }) => {
  try {
    const responseData = await $fetch("/api/newpassword/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: values,
    });
    if (responseData) {
      openSuccess();
      resetForm();
      openSuccessLogin();
    }
  } catch (error) {
    openErrorEmail();
    console.error("Failed to change password:", error);
  }
};

const schema = object({
  newPassword: string()
    .required("Введите новый пароль")
    .min(5, "Пароль не должен быть короче 5 символов")
    .notOneOf(
      [yupRef("oldPassword"), null],
      "Новый пароль не должен совпадать со старым"
    ),

  confirmPassword: string()
    .required("Введите новый пароль повторно")
    .oneOf([yupRef("newPassword"), null], "Пароли не совпадают")
    .notOneOf(
      [yupRef("oldPassword"), null],
      "Новый пароль не должен совпадать со старым"
    ),
});
const openSuccess = () => {
  ElNotification({
    title: "Success",
    message: "Пароль успешно изменён",
    type: "success",
    position: "bottom-left",
    duration: 6000,
  });
};
const openSuccessLogin = () => {
  ElMessageBox.alert(
    "Теперь вы можете войти в кабинет.",
    "Пароль успешно изменён",
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
const openErrorEmail = () => {
  ElNotification({
    title: "Error",
    message: "Невозможно изменить пароль",
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
          <h1 class="h1-info">Восстановить пароль</h1>

          <div class="columns">
            <div class="column is-5">
              <div v-if="restoreCod" class="login-form">
                <VeeForm
                  :initial-values="form"
                  :validation-schema="schema"
                  @submit="changePassword"
                >
                  <CabinetVTextInput
                    type="password"
                    name="newPassword"
                    label="Новый пароль"
                    placeholder="Введите новый пароль"
                    leftIcon="solar:lock-unlocked-broken"
                  />
                  <CabinetVTextInput
                    type="password"
                    name="confirmPassword"
                    label="Повторите пароль"
                    placeholder="Введите повторный пароль"
                    leftIcon="solar:lock-unlocked-broken"
                  />

                  <button type="submit" class="button is-success is-light">
                    Сохранить
                  </button>
                </VeeForm>
                <div class="info-reg">
                  <span>Есть аккаунт</span>
                  <nuxt-link to="/login" class="button is-success is-light"
                    >Войти</nuxt-link
                  >
                </div>
              </div>
              <div v-else class="login-form">
                Отсуствует код восстановления пароля
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
