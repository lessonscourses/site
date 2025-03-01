<script setup>
import { object, string, ref as yupRef } from "yup";
import { configure } from "vee-validate";

const { data: user } = useAuth();

const form = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
  id_user: user.value.user._id,
};

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: true,
  validateOnModelUpdate: true,
});

const changePassword = async (values, { resetForm }) => {
  try {
    const responseData = await $fetch("/api/changepassword/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: values,
    });
    if (responseData) {
      openSuccess();
      resetForm();
    }
  } catch (error) {
    openError();
    console.error("Failed to change password:", error);
  }
};

const schema = object({
  oldPassword: string()
    .required("Введите текущий пароль")
    .min(5, "Пароль не должен быть короче 5 символов"),

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
const openError = () => {
  ElNotification({
    title: "Error",
    message: "Текущий пароль введён не верно",
    type: "error",
    position: "bottom-left",
    duration: 6000,
  });
};
const openSuccess = () => {
  ElNotification({
    title: "Success",
    message: "Пароль успешно изменён",
    type: "success",
    position: "bottom-left",
    duration: 6000,
  });
};
</script>

<template>
  <div>
    <ClientOnly>
      <VeeForm
        :initial-values="form"
        :validation-schema="schema"
        @submit="changePassword"
      >
        <CabinetVTextInput
          type="password"
          name="oldPassword"
          label="Текущий пароль"
          placeholder="Введите новый пароль"
          leftIcon="solar:lock-unlocked-broken"
        />
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
    </ClientOnly>
  </div>
</template>
