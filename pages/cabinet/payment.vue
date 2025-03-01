<script setup>
definePageMeta({
  middleware: "auth",
  title: "My home page",
  layout: "custom",
});
const { data: user } = useAuth();
const mobileScin = ref(true);
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);
const drawer = ref(false);
const buttonEdit = ref(false);
const dataOrder = ref({});
const orderNum = ref("");

const { data: userData } = await useFetch("/api/purchases/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { userid: user.value.user._id, lastitem: "" },
});

const drawerIn = (item) => {
  for (let unit in item) {
    orderNum.value = item["order"];
    if (
      unit != "_id" &&
      unit != "__v" &&
      unit != "id_user" &&
      unit != "order"
    ) {
      if (unit == "tariff") {
        dataOrder.value["Тарифный план"] = item[unit];
      } else if (unit == "date_payment") {
        dataOrder.value["Дата оплаты"] = timeFun(item[unit]);
      } else if (unit == "expiration_date") {
        dataOrder.value["Дата блокировки"] = timeFun(item[unit]);
      } else if (unit == "cost" || unit == "currency") {
        if (unit == "cost") {
          dataOrder.value["Стоимость"] = item[unit];
        }
        if (unit == "currency") {
          dataOrder.value["Валюта"] = item[unit];
        }
      } else if (unit == "status") {
        if (item[unit] == "true") {
          item[unit] = "Активирован";
        } else {
          item[unit] = "Не активен";
        }
        dataOrder.value["Статус"] = item[unit];
      }
    }
  }
  drawer.value = true;
  buttonEdit.value = false;
};
const handleCurrentChange = (val) => {
  if (val == 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * 10 - 10;
  }
  currentPage.value = val;
  refresh();
};

const timeFun = (newValue) => {
  const currentDate = new Date(newValue);
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const formattedDateTime = `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};
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
              <h1 class="h1-cabinet">Мои оплаты</h1>

              <div class="drawer-add">
                <div class="drawer-cat-all" v-if="userData.length > 0">
                  <div class="drawer-cat" v-for="item in userData" :key="item">
                    <div class="drawer-cat-left">
                      <span>{{ item.order }}</span>
                      <strong>{{ item.tariff }}</strong>
                    </div>

                    <!-- <span>{{ item.description }}</span> -->
                    <div class="drawer-cat-right">
                      <button
                        class="button is-warning is-normal is-light"
                        type="submit"
                        @click="drawerIn(item)"
                      >
                        Подробнее
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <span>Ище нет оплат</span>
                </div>
                <ClientOnly>
                  <el-drawer
                    v-model="drawer"
                    class="drawer-cabinet"
                    title="Подробнее о заказе"
                    :with-header="false"
                    size="60%"
                  >
                    <div class="drawer-block">
                      <strong>Оплата № {{ orderNum }}</strong>
                      <div class="drawer-block-order">
                        <div
                          v-for="(item, index) in dataOrder"
                          :key="item"
                          class="drawer-order-item"
                        >
                          <span>{{ index }}</span
                          ><b>:</b><strong>{{ item }}</strong>
                        </div>
                      </div>
                      <button
                        class="button is-success"
                        type="submit"
                        @click="drawer = false"
                      >
                        Закрыть
                      </button>
                    </div>
                  </el-drawer>
                </ClientOnly>
              </div>
            </div>
            <!-- <el-pagination
              background
              layout="prev, pager, next"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="tariffs.count"
              @current-change="handleCurrentChange"
            /> -->
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
