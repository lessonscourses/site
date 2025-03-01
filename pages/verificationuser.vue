<script setup>
definePageMeta({
  middleware: "auth",
  title: "My home page",
  layout: "custom",
});
const route = useRoute();
const verificationcod = ref("");

const { data: user } = useAuth();

const { data: userItemVer, refresh } = await useFetch(
  () => "/api/usercabinet/",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: user.value.user._id,
  }
);

if (route.query.cod !== "") {
  verificationcod.value = route.query.cod;
  if (
    user.value &&
    userItemVer.value.result[0].userData[0].verification === false
  ) {
    const { data: userItem } = await useFetch(() => "/api/verification/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: { activation_get: verificationcod.value, verification: true },
    });
    console.log("Подтверждён");
    // Далее вы можете обрабатывать результат запроса userItem
  } else {
    openSuccess();
    console.log("Уже подтверждён");
  }
}
const openSuccess = () => {
  ElNotification({
    title: "Success",
    message: "Аккаунт уже подтверждён",
    type: "success",
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
          <div class="success-block">
            <h1>Информация об аккаунте</h1>
            <h2>
              Верификация завершилась успешно
              <Icon name="solar:check-square-broken" />
            </h2>
            <span
              >Для открытия доступа к материалам необходимо выбрать тарифный
              план!</span
            >
            <nuxt-link to="/pricing" class="button is-success is-light"
              >К тарифам</nuxt-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
