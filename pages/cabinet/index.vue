<script setup>
import { object, string, ref as yupRef } from "yup";
definePageMeta({
  middleware: "auth",
  title: "My home page",
  layout: "custom",
});
import { UploadFilled } from "@element-plus/icons-vue";

const { data: user } = useAuth();
const mobileScin = ref(true);
const lastData = ref("");
const dataRegistration = ref("");
const buttonEdit = ref(false);
const drawer = ref(false);
const visible = ref(false);
const imfArr = ref([]);
const uploadFile = ref("");
const userId = ref("");
const statusUser = ref(false);
const countdownTime = ref(0);
const currentDate = new Date();
const form = ref({
  email: "",
  username: "",
  password: "",
  userData: [
    {
      date_registration: "",
      activation_date: "",
      activation_get: "",
      img: [],
      status: false,
      blocking: false,
      verification: false,
      restore_password: "",
    },
  ],
});

const timeInfo = (newValue) => {
  const currentDate = new Date(newValue);
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();

  const formattedDateTime = `${day}.${month}.${year}`;
  return formattedDateTime;
};

if (user.value) {
  userId.value = user.value.user._id;
}

const editUser = async () => {
  const responseData = await $fetch("/api/update/updateuser/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
  if (responseData) {
    refresh();
  }
};

const { data: userItem, refresh } = await useFetch(() => "/api/usercabinet/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: userId.value,
});

if (userItem.value) {
  dataRegistration.value = timeInfo(
    userItem.value.result[0].userData[0].date_registration
  );
  lastData.value = userItem.value.result[0].userData[0].activation_date;
  statusUser.value = userItem.value.result[0].userData[0].status;

  if (lastData.value == null) {
    statusUser.value = false;
  }

  const targetDate = new Date(lastData.value);

  if (currentDate.getTime() <= targetDate.getTime()) {
    console.log("Дата актуальна или еще не наступила.");
  } else {
    console.log("Дата уже прошла.");
    statusUser.value = false;
    const userDataSucces = await $fetch("/api/success/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: {
        id_user: user.value.user._id,
        status: false,
        activation_date: lastData.value,
      },
    });
  }
} else {
  lastData.value = 0;
}
console.log(lastData.value);

const timeFun = (newValue) => {
  const expirationDate = new Date(newValue);
  // Вычисляем разницу между временем истечения срока и текущим временем
  const currentTime = new Date();
  const difference = expirationDate.getTime() - currentTime.getTime();
  // Устанавливаем количество миллисекунд для отсчета в <vue-countdown>
  countdownTime.value = difference;
};
timeFun(lastData.value);

const drawerIn = (item) => {
  form.value._id = item._id;
  (form.value.email = item.email),
    (form.value.password = item.password),
    (form.value.username = item.username),
    (imfArr.value = []);

  if (item.userData && item.userData.length > 0) {
    for (let itemIn in item.userData[0]) {
      form.value.userData[0][itemIn] = item.userData[0][itemIn];
    }
    if (form.value.userData[0].img.length > 0) {
      form.value.userData[0].img = item.userData[0].img;
      imfArr.value = item.userData[0].img;
    }
  }

  drawer.value = true;
  buttonEdit.value = false;
};
const addImg = (file) => {
  if (file.size <= 200000) {
    const reader = new FileReader();
    reader.onload = (event) => {
      form.value.userData[0].img.push({
        name: file.name,
        url: event.target.result,
      });
    };
    reader.readAsDataURL(file);
  } else {
    openErrorFileSize();
    imfArr.value = [];
    form.value.userData[0].img = [];
    uploadFile.value.upload.clearFiles();
  }
};
const handleRemove = (uploadFile, uploadFiles) => {};
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

const validateName = string()
  .required("Введите имя")
  .min(3, "Имя не должно быть короче 3 символов");
const validateEmail = string()
  .required("Введите Ваш email")
  .email("Введите корректный email адрес");

const openErrorFileSize = () => {
  ElNotification({
    title: "Error",
    message: "Файл более 200kb",
    type: "error",
    position: "bottom-left",
    duration: 6000,
  });
};
</script>
<template>
  <div>
    <div class="bd-docs-main">
      <div class="container is-max-desktop">
        <div class="columns">
          <div v-if="mobileScin == false" class="column is-12">
            <cabinet-LeftBar />
          </div>
          <div class="column is-8">
            <div class="content">
              <h1 class="h1-cabinet">Профиль</h1>
              <div class="user-index">
                <div class="user-index-inf">
                  <div v-for="item in userItem.result" :key="item">
                    <div
                      class="drawer-cat-img"
                      v-if="item.userData[0].img.length"
                    >
                      <img
                        v-for="imgurl in item.userData[0].img"
                        :key="imgurl"
                        :src="imgurl.url"
                      />
                    </div>
                    <div v-else class="drawer-cat-img">
                      <img src="/noimg.webp" />
                    </div>
                    <div class="user-index-inf-data">
                      <div class="user-index-inf-data-block">
                        <span>Имя</span><strong>{{ item.username }}</strong>
                      </div>
                      <div class="user-index-inf-data-block">
                        <span>Email</span><strong>{{ item.email }}</strong>
                      </div>
                      <div class="user-index-inf-data-block">
                        <span>Активация</span>
                        <div v-if="statusUser == false" class="user-index-time">
                          Не активирован
                        </div>
                        <div v-else class="user-index-time">
                          <ClientOnly>
                            <vue-countdown
                              v-if="lastData != 0"
                              :time="countdownTime"
                              v-slot="{ days, hours, minutes, seconds }"
                            >
                              истечёт через：{{ days }} дн., {{ hours }} ч.,
                              {{ minutes }} мин., {{ seconds }} сек.
                            </vue-countdown>
                            <div v-else>
                              <nuxt-link to="/pricing"
                                >Нужно выбрать тариф</nuxt-link
                              >
                            </div>
                          </ClientOnly>
                        </div>
                      </div>
                      <div class="user-index-inf-data-block">
                        <span>Верификация</span>
                        <div v-if="item.userData[0].verification == false">
                          Не верифицирован
                        </div>
                        <div v-else>Верифицирован</div>
                      </div>
                      <div class="user-index-inf-data-block">
                        <span>Дата регистрации</span>{{ dataRegistration }}
                      </div>
                    </div>
                  </div>
                  <button
                    class="button is-warning is-normal is-light"
                    type="submit"
                    @click="drawerIn(userItem.result[0])"
                  >
                    <span class="icon"
                      ><Icon name="solar:pen-new-square-broken"
                    /></span>
                    <span>Редактировать</span>
                  </button>
                </div>
                <div class="user-index-password">
                  <h4>Изменить пароль</h4>
                  <CabinetChangePassword v-show="visible == true" />
                  <button
                    class="button button-meny is-light"
                    @click="visible = !visible"
                  >
                    <span class="icon">
                      <Icon
                        :name="
                          visible
                            ? 'solar:close-circle-broken'
                            : 'solar:pen-new-square-broken'
                        "
                      />
                    </span>
                    <span v-if="!visible">Редактировать</span>
                    <span v-else>Скрыть</span>
                  </button>
                </div>
                <ClientOnly>
                  <el-drawer
                    v-model="drawer"
                    title="Редактировать данные"
                    class="drawer-cabinet"
                    :with-header="false"
                    size="60%"
                  >
                    <!-- <span>Редактировать данные</span> -->

                    <div class="drawer-block">
                      <VeeForm @submit="editUser">
                        <div
                          class="field"
                          v-for="(item, index) in form"
                          :key="index"
                        >
                          <div class="control" v-if="index == 'username'">
                            <VeeField
                              class="input"
                              type="text"
                              name="username"
                              :rules="validateName"
                              :placeholder="index"
                              v-model="form[index]"
                            />
                            <VeeErrorMessage name="username" />
                          </div>

                          <div class="control" v-if="index == 'email'">
                            <VeeField
                              class="input"
                              type="text"
                              name="useremail"
                              :rules="validateEmail"
                              :placeholder="index"
                              v-model="form[index]"
                            />
                            <VeeErrorMessage name="useremail" />
                          </div>

                          <div v-if="index == 'userData'">
                            <div
                              class="field"
                              v-for="(itemIn, indexIn) in form[index][0]"
                              :key="indexIn"
                            >
                              <div class="control" v-if="indexIn === 'img'">
                                <el-upload
                                  class="upload-demo"
                                  :before-upload="addImg"
                                  :on-remove="handleRemove"
                                  ref="uploadFile"
                                  drag
                                  action="#"
                                  multiple
                                  :limit="1"
                                  list-type="picture"
                                  v-model:file-list="imfArr"
                                >
                                  <el-icon class="el-icon--upload"
                                    ><upload-filled
                                  /></el-icon>
                                  <div class="el-upload__text">
                                    Нажмите или перетащите
                                    <em>для загрузки аватара </em>
                                  </div>
                                  <template #tip>
                                    <div class="el-upload__tip">
                                      jpg/png/webp размер файла не более чем
                                      200KB.
                                    </div>
                                  </template>
                                </el-upload>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="buttons">
                          <button
                            class="button is-success is-light"
                            type="button"
                            @click="drawer = false"
                          >
                            Закрыть
                          </button>
                          <button
                            class="button is-success"
                            type="submit"
                            @click="drawer = false"
                          >
                            Сохранить
                          </button>
                        </div>
                      </VeeForm>
                    </div>
                  </el-drawer>
                </ClientOnly>
              </div>
            </div>
          </div>
          <div v-if="mobileScin == true" class="column is-4">
            <cabinet-LeftBar />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
