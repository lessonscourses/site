<script setup>
const combinedData = ref([]);
const { data: category } = await useFetch("/api/category/", {
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

for (const item of category.value) {
  const matchingItems = datachild.value.filter(
    (child) => child.category == item.kirilica
  );
  combinedData.value.push({ ...item, children: matchingItems });
}
</script>

<template>
  <div>
    <div data-aos="fade-up" data-aos-delay="300" data-aos-once="true">
      <div class="columns is-multiline">
        <div class="column is-12">
          <h4><icon name="solar:video-library-outline" />Топ разделы</h4>
        </div>
        <div class="column is-12">
          <div class="top-category">
            <div
              v-for="item in combinedData"
              :key="item"
              class="top-category-item"
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
      </div>
    </div>
  </div>
</template>
