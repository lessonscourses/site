<script setup>
const form = ref({
  username: "",
  phone: "",
  email: "",
  description: "",
});
const myButton = ref(null);
const myName = ref(null);
const myPhone = ref(null);
const modalSucces = ref(false);
const emit = defineEmits(["ClosedModal"]);
const handleLogin = async () => {
  myName.value.classList.remove("is-danger");
  myPhone.value.classList.remove("is-danger");
  if (form.value.username != "" && form.value.phone != "") {
    myButton.value.classList.add("is-loading");
    const { data: responseData } = await useFetch("/api/mailsend/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: form.value,
    });
    if (responseData) {
      emit("ClosedModal", false);
      myButton.value.classList.remove("is-loading");
      myName.value.classList.remove("is-danger");
      myPhone.value.classList.remove("is-danger");
      modalSucces.value = true;
      form.value = {};
    }
  } else {
    if (form.value.username == "") {
      myName.value.classList.add("is-danger");
    }
    if (form.value.phone == "") {
      myPhone.value.classList.add("is-danger");
    }
  }
};
</script>
<template>
  <div>
    <div data-aos="fade-up" data-aos-delay="900" data-aos-once="true">
      <div class="index-order-info">
        <Teleport to="body">
          <div v-if="modalSucces" class="modal-succes">
            <strong>Благодарим за заявку!</strong>
            <p>Мы свяжемся с Вами в ближайшее время.</p>
            <button
              class="delete is-large"
              @click="modalSucces = false"
            ></button>
          </div>
        </Teleport>
        <form @submit.prevent="handleLogin">
          <div class="field">
            <div class="control is-medium has-icons-left has-icons-right">
              <input
                ref="myName"
                class="input is-medium"
                type="text"
                placeholder="Ваше имя"
                v-model="form.username"
              />
              <span class="is-small icon is-left">
                <Icon name="solar:user-rounded-broken" />
              </span>
              <span class="icon is-small is-right">
                <Icon name="solar:star-shine-broken" />
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control is-medium has-icons-left has-icons-right">
              <input
                ref="myPhone"
                class="input is-medium"
                placeholder="+375 "
                v-model="form.phone"
                v-maska
                data-maska="+375(##) ###-##-##"
              />
              <span class="is-small icon is-left">
                <Icon name="solar:call-dropped-broken" />
              </span>
              <span class="icon is-small is-right">
                <Icon name="solar:star-shine-broken" />
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control is-medium has-icons-left">
              <input
                class="input is-medium"
                type="text"
                placeholder="Ваше E-mail"
                v-model="form.email"
              />
              <span class="is-small icon is-left">
                <Icon name="solar:user-rounded-broken" />
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <textarea
                class="textarea"
                placeholder="Комментарий"
                v-model="form.description"
              ></textarea>
            </div>
          </div>

          <div class="field">
            <div class="control form-info-but">
              <button
                ref="myButton"
                class="button is-success index-b-modal"
                type="submit"
              >
                Отправить заявку
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
