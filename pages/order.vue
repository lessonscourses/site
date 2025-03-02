<script setup>
definePageMeta({
  middleware: "auth",
  title: "My home page",
  layout: "custom",
});
const { data: user } = useAuth();
const route = useRoute();
const titleTarif = ref("");
const idUser = ref("");
const tarifCost = ref("");
const mountTariff = ref("");
const currencyTariff = ref("");
const randomNumbers = Array.from({ length: 1 }, () =>
  Math.floor(Math.random() * 100000000)
).toString();
const {
  data: tariffs,
  error,
  refresh,
} = await useFetch("/api/tariffs/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
if (tariffs.value) {
  for (let item in tariffs.value) {
    if (tariffs.value[item].link == route.query.pricing) {
      titleTarif.value = tariffs.value[item].name;
      tarifCost.value = tariffs.value[item].price;
      mountTariff.value = parseInt(tariffs.value[item].mount);
      currencyTariff.value = tariffs.value[item].currency;
    }
  }
}
if (user.value != null) {
  idUser.value = user.value.user._id;
}

const form = ref({
  id_user: idUser.value,
  tariff: titleTarif.value,
  date_payment: "",
  expiration_date: "",
  cost: tarifCost.value,
  status: true,
  currency: currencyTariff.value,
  order: randomNumbers,
  mount: mountTariff.value,
  // m_shop: "",
  // m_orderid: "1",
  // m_amount: "100",
  // m_curr: "USD",
  // m_desc: "Test",
  // m_key: "Ваш секретный ключ",
  // sign: "",
});

const currentDate = new Date();
const isoString = currentDate.toISOString();

const submitForm = async () => {
  try {
    // Создаем заказ в базе
    const { data: response } = await useFetch("/api/add/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: form.value,
    });

    // Отправляем запрос на создание платежа
    const paymentResponse = await fetch("/api/payment/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: tarifCost.value,
        orderId: randomNumbers,
      }),
    }).then((res) => res.json());

    if (paymentResponse.status === "success") {
      window.location.href = paymentResponse.urlPayment; // Перенаправляем пользователя на оплату
    } else {
      console.error("Ошибка при создании платежа:", paymentResponse);
    }
  } catch (error) {
    console.error("Ошибка при отправке формы:", error);
  }
};
</script>
<template>
  <div>
    <div class="bd-docs-main">
      <div class="container is-max-desktop">
        <div class="content">
          <div class="back" @click="$router.back()">
            <Icon name="solar:round-alt-arrow-left-broken" />
            <strong>К списку тарифов</strong>
          </div>
          <div class="index-title order-title">
            <h1 class="title">Выбранный тариф - {{ titleTarif }}</h1>
          </div>
          <div class="form-order">
            <div class="form-order-info">
              <p>
                <span>Номер заказа</span><b>:</b
                ><strong>№{{ randomNumbers }}</strong>
              </p>
              <p>
                <span>Период</span><b>:</b
                ><strong>{{ mountTariff }}<span>м.</span></strong>
              </p>
              <p>
                <span>Стоимость</span><b>:</b
                ><strong>{{ tarifCost }}<span>руб.</span></strong>
              </p>
            </div>
            <form @submit.prevent="submitForm">
              <button class="button" type="submit">Перейти к оплате</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
