<script setup>
definePageMeta({
  middleware: "auth",
  title: "My home page",
  layout: "custom",
});
const route = useRoute();
const statusUser = ref(false);
const statusOrder = ref(true);
const lastId = ref(1);
const lastData = ref("");
const usrDataActive = ref("");
const dataActive = ref("");
const currentDate = new Date();
const mountAdd = ref("");
const isoString = currentDate.toISOString();

const { data: user } = useAuth();

if (user.value && user.value.user) {
  const { data: userData } = await useFetch("/api/purchases/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: { userid: user.value.user._id, lastitem: lastId },
  });

  if (userData.value != null && userData.value.length > 0) {
    lastData.value = userData.value[0].expiration_date;
    mountAdd.value = parseInt(userData.value[0].mount);
  } else {
    lastData.value = 0;
  }

  const { data: userItem, refresh } = await useFetch(
    () => "/api/usercabinet/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: user.value.user._id,
    }
  );

  if (userItem.value != null && userItem.value.result.length > 0) {
    usrDataActive.value = userItem.value.result[0].userData[0].activation_date;
  }
  if (usrDataActive.value == null) {
    dataActive.value = lastData.value;
  } else {
    const targetDate = new Date(usrDataActive.value);

    if (currentDate.getTime() <= targetDate.getTime()) {
      console.log("Дата актуальна или еще не наступила.");

      dataActive.value = targetDate.setMonth(
        targetDate.getMonth() + mountAdd.value
      );
      dataActive.value = targetDate.toISOString();
    } else {
      console.log("Дата уже прошла.");
      dataActive.value = lastData.value;
    }
  }

  const userDataSucces = await $fetch("/api/success/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: {
      id_user: user.value.user._id,
      status: statusOrder.value,
      activation_date: dataActive.value,
    },
  });
  //statusUser.value = userDataSucces.value[0][0].status;
}
</script>
<template>
  <div>
    <div class="bd-docs-main">
      <div class="container is-max-desktop">
        <div class="content">
          <div class="success-block">
            <h1>Информация о заказе</h1>
            <h2>
              Оплата прошла успешно <Icon name="solar:check-square-broken" />
            </h2>
            <span
              >Спасибо, что выбрали нас, доступ к материалам открыт, успехов в
              обучении!</span
            >
            <nuxt-link to="/cabinet/" class="button is-success is-light"
              >В кабинет</nuxt-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
