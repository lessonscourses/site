<script setup>
const category = ref([]);
const visible = ref(false);
const router = useRouter();
const catData = ref([]);

const { data: catDataFeth } = await useFetch("/api/category/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const { data: datachild } = await useFetch("/api/childcategory/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

const fetchCategory = async () => {
  // const data = await $fetch("/api/category/", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json; charset=UTF-8",
  //   },
  // });
  // const datachild = await $fetch("/api/childcategory/", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json; charset=UTF-8",
  //   },
  // });

  const combinedData = [];
  for (const item of catDataFeth.value) {
    const matchingItems = datachild.value.filter(
      (child) => child.category == item.kirilica
    );
    combinedData.push({ ...item, children: matchingItems });
  }
  if (combinedData.length > 0) {
    combinedData[0].active = true;
    combinedData[0].activelink = true;
  }
  category.value = combinedData;
};

fetchCategory();

watch(
  () => router.currentRoute.value,
  () => {
    fetchCategory();
  }
);

const onClickOutside = (event) => {
  if (
    !event.target.closest(".meny-nav-cat") &&
    event.target.className !== "none-meny" &&
    !event.target.closest(".button-meny")
  ) {
    visible.value = false;
  }
};

const handleMouseEnter = (item) => {
  category.value.forEach((i) => ((i.active = false), (i.activelink = false)));
  item.activelink = true;
  item.active = true;
};

const restoreLastActive = () => {};
</script>

<template>
  <div>
    <div class="meny-nav">
      <button class="button button-meny is-light" @click="visible = !visible">
        <span class="icon is-small">
          <Icon
            :name="
              visible
                ? 'solar:close-circle-broken'
                : 'solar:hamburger-menu-broken'
            "
          />
        </span>
        <span class="none-meny">Категории</span>
      </button>
      <div
        class="meny-nav-cat"
        v-show="visible == true"
        v-click-outside="onClickOutside"
        @mouseleave="restoreLastActive"
      >
        <div v-if="category.length > 0" class="meny-nav-show">
          <div
            class="meny-nav-cat-item"
            v-for="item in category"
            :key="item._id"
          >
            <nuxt-link
              :to="`/catalog/` + item.kirilica"
              @mouseover="handleMouseEnter(item)"
              @click="visible = false"
              :class="{ 'meny-nav-active': item.activelink }"
            >
              <strong class="meny-nav-title">
                <Icon v-if="item.img" :name="item.img" />
                {{ item.name }}
              </strong>
            </nuxt-link>
            <div
              @mouseover="handleMouseEnter(item)"
              class="meny-nav-block"
              :class="{ 'meny-nav-block-active': item.active }"
            >
              <div
                class="meny-nav-block-child"
                v-for="itemChild in item.children"
                :key="itemChild"
              >
                <nuxt-link
                  :to="'/catalog/' + item.kirilica + '/' + itemChild.kirilica"
                  @click="visible = false"
                >
                  <NuxtImg
                    provider="aliyun"
                    v-if="itemChild.img.length"
                    :src="itemChild.img[0].url"
                    :alt="itemChild.img[0].name"
                    format="wepb"
                    loading="lazy"
                  />
                  <span> {{ itemChild.name }}</span>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <!-- <div v-else class="meny-nav-show">
          <p>No categories available.</p>
        </div> -->
      </div>
    </div>
  </div>
</template>
