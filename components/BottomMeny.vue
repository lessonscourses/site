<script setup>
import VueBottomSheet from "@webzlodimir/vue-bottom-sheet";
import "@webzlodimir/vue-bottom-sheet/dist/style.css";

const { data: user, signOut } = useAuth();

const myBottomSheet = ref(null);

const open = () => {
  myBottomSheet.value.open();
  document.body.classList.add("overflow-hidden");
};

const handleClose = () => {
  if (document.body) {
    document.body.classList.remove("overflow-hidden");
  }
};

const close = () => {
  myBottomSheet.value.close();
  if (document.body) {
    document.body.classList.remove("overflow-hidden");
  }
};

const Exit = async () => {
  if (myBottomSheet.value) {
    close();
    await signOut({ redirect: false });
    if (!useAuth().data.value) {
      return navigateTo("/");
    }
  }
};
</script>

<template>
  <div>
    <client-only>
      <button @click="open" class="button">
        <span class="icon">
          <Icon name="solar:menu-dots-square-broken" />
        </span>
        <span>Меню</span>
      </button>
      <vue-bottom-sheet ref="myBottomSheet" @closed="handleClose">
        <!-- <nuxt-link to="/contact">Контакты</nuxt-link> -->
        <div class="bottom-bar" v-if="user === null">
          <nuxt-link @click="close" class="button is-success" to="/login"
            ><Icon name="solar:login-3-broken" />Вход</nuxt-link
          >
          <nuxt-link
            @click="close"
            class="button is-success is-light"
            to="/registration"
            ><Icon
              name="solar:user-plus-rounded-broken"
            />Регистрация</nuxt-link
          >
        </div>
        <div class="bottom-bar" v-if="user != null">
          <nuxt-link @click="close" to="/cabinet"
            ><Icon name="solar:user-broken" />Кабинет</nuxt-link
          >
          <button @click="Exit" class="button">
            <span class="icon"><Icon name="solar:exit-broken" /></span
            ><span>Выход</span>
          </button>
        </div>
        <div class="bottom-bar">
          <nuxt-link class="b-none" to="/pricing" @click="close"
            ><Icon name="solar:tag-price-broken" />Тарифы</nuxt-link
          >
        </div>
      </vue-bottom-sheet>
    </client-only>
  </div>
</template>

<style>
.overflow-hidden {
  overflow-y: hidden !important;
}
</style>
