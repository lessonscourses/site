<script setup>
import animationLottie from "@/content/animation_pricing.json";
const { $anime } = useNuxtApp();
const mobileScin = ref(100);
const heightAnimation = ref(300);
const isVisible = ref(true);
const lottieAnimation = ref(null);
const { data: user } = useAuth();
const linkInfo = ref({
  name: "Авторизация",
  link: "/login",
});
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

if (user.value != null) {
  linkInfo.value.name = "Выбрать";
}

const animationFun = () => {
  $anime({
    targets: [".title", ".title-h2"],
    translateY: [mobileScin.value],
    easing: "easeInOutExpo",
    delay: 0,
    opacity: {
      value: 1,
    },
  });
};

const mobailScrin = () => {
  window.addEventListener("resize", (event) => {
    if (event.target.innerWidth <= 800) {
      mobileScin.value = 50;
      heightAnimation.value = 240;
    } else {
      mobileScin.value = 100;
      heightAnimation.value = 300;
    }
  });
  if (document.documentElement.clientWidth <= 800) {
    mobileScin.value = 50;
    heightAnimation.value = 240;
  } else {
    mobileScin.value = 100;
    heightAnimation.value = 300;
  }
};

onMounted(() => {
  mobailScrin();
  animationFun();
});
onBeforeUnmount(() => {
  // Сброс анимации перед размонтированием компонента
  $anime({
    targets: [".title", ".title-h2"],
    translateY: 0, // Возвращаем начальное положение
    opacity: 0, // Скрываем элементы
    duration: 0, // Длительность анимации равна 0, чтобы мгновенно выполнить сброс
  });
  lottieAnimation.value.destroy();
});
</script>
<template>
  <div>
    <div class="bd-docs-main">
      <div class="container is-max-desktop">
        <div class="content">
          <div class="index-title">
            <h1 class="title">Тарифные планы</h1>
            <div class="title-h2">
              <span>Присоединяйтесь.</span>
            </div>
            <div class="index-lottie">
              <client-only>
                <Vue3Lottie
                  ref="lottieAnimation"
                  :animationData="animationLottie"
                  :height="heightAnimation"
                  :width="500"
                />
              </client-only>
            </div>
          </div>
          <div class="index-desctiption">
            <div class="columns is-multiline">
              <div class="column is-3" v-for="item in tariffs" :key="item">
                <div
                  v-show="isVisible"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-once="true"
                >
                  <div class="pricing-block">
                    <strong>{{ item.name }}</strong>
                    <div class="pricing-block-mount">
                      <Icon name="solar:calendar-broken" />
                      <span>{{ item.mount }}<strong>м.</strong></span>
                    </div>
                    <div class="pricing-block-cost">
                      <Icon name="solar:tag-price-broken" />
                      <span
                        >{{ item.price
                        }}<strong>{{ item.currency }}</strong></span
                      >
                    </div>
                    <nuxt-link
                      class="button is-white"
                      :to="'/order?pricing=' + item.link"
                      >{{ linkInfo.name }}</nuxt-link
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
