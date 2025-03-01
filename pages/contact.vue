<script setup>
import animationLottie from "@/content/animation_contact.json";

const { $anime } = useNuxtApp();
const mobileScin = ref(100);
const lottieAnimation = ref(null);
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
    } else {
      mobileScin.value = 100;
    }
  });
  if (document.documentElement.clientWidth <= 800) {
    mobileScin.value = 50;
  } else {
    mobileScin.value = 100;
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
useHead({
  title: "WebOko — Наши контакты",
  meta: [
    {
      hid: "description",
      name: "description",
      content: "Связаться с нами.",
    },
    {
      hid: "og:title",
      property: "og:title",
      content: "WebOko — Наши контакты",
    },
    {
      hid: "og:description",
      property: "og:description",
      content: "Связаться с намию",
    },
    {
      hid: "og:image",
      property: "og:image",
      content: "https://weboko.net/nuxt-imf.webp",
    },
  ],
});
</script>

<template>
  <div>
    <div class="bd-docs-main">
      <div class="container is-max-desktop">
        <div class="content">
          <div class="index-title">
            <h1 class="title">Контакты</h1>
            <div class="title-h2">
              <span>Здесь Вы можете отправить заявку на разработку.</span>
            </div>
            <div class="index-lottie">
              <client-only>
                <Vue3Lottie
                  ref="lottieAnimation"
                  :animationData="animationLottie"
                  :height="300"
                  :width="500"
                />
              </client-only>
            </div>
          </div>
          <div class="contact-form">
            <Order />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
