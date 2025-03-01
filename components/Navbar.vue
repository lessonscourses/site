<script setup>
let Glitch;
const isGlitchLoaded = ref(false);

const { data: user, signOut } = useAuth();

const mobileScin = ref(true);

onMounted(() => {
  window.addEventListener("resize", (event) => {
    if (event.target.innerWidth <= 800) {
      mobileScin.value = false;
    } else {
      mobileScin.value = true;
    }
  });
  if (document.documentElement.clientWidth <= 800) {
    mobileScin.value = false;
  } else {
    mobileScin.value = true;
  }
});

const Exit = async () => {
  await signOut({ redirect: false });
  if (!useAuth().data.value) {
    return navigateTo("/");
  }
};

onMounted(async () => {
  ({ Glitch } = await import("vue-glitched"));

  isGlitchLoaded.value = true;
});
</script>
<template>
  <div>
    <div class="bd-docs-main" :class="{ 'mobail-header': mobileScin == false }">
      <div class="container is-max-desktop">
        <div class="index-header">
          <div
            class="header-nav"
            :class="{ 'mobail-meny': mobileScin == false }"
          >
            <div class="header-logo">
              <nuxt-link to="/">
                <Glitch
                  v-if="isGlitchLoaded"
                  id="psychadelic"
                  fga="red"
                  fgb="blue"
                >
                  Weboko
                </Glitch>
              </nuxt-link>
            </div>

            <div class="cat-bar">
              <NavCategory v-if="mobileScin == true" />
              <NavMobailCatgory v-else />
            </div>
            <div v-if="mobileScin == true" class="left-bar">
              <div class="left-bar-auth">
                <nuxt-link to="/pricing">Тарифы</nuxt-link>
              </div>
              <!-- <nuxt-link to="/contact">Контакты</nuxt-link> -->
              <div class="left-bar-auth" v-if="user === null">
                <nuxt-link class="button is-success" to="/login"
                  >Вход</nuxt-link
                >
                <nuxt-link class="button is-success is-light" to="/registration"
                  >Регистрация</nuxt-link
                >
              </div>
              <div class="left-bar-auth" v-else>
                <nuxt-link to="/cabinet">Кабинет</nuxt-link>
                <button @click="Exit" class="button">Выход</button>
              </div>
            </div>
            <div v-if="mobileScin == false" class="left-bar">
              <BottomMeny />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="mobileScin == false" class="mg-mobail"></div>
  </div>
</template>
