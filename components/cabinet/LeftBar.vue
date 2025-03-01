<script setup>
const { data: user, signOut } = useAuth();

const Exit = async () => {
  await signOut({ redirect: false });
  if (!useAuth().data.value) {
    return navigateTo("/");
  }
};
</script>

<template>
  <div class="meny-cabinet">
    <aside class="menu">
      <p class="menu-label">Меню</p>
      <ul class="menu-list">
        <li><nuxt-link to="/cabinet/">Профиль</nuxt-link></li>
        <li><nuxt-link to="/cabinet/payment">Оплаты</nuxt-link></li>

        <!-- <li><button @click="Exit" class="button">Exit</button></li> -->
      </ul>
    </aside>
  </div>
</template>
