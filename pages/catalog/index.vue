<script setup>
const route = useRoute();
const router = useRouter();
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);

if (router.currentRoute.value.query.page != undefined) {
  currentPage.value = parseInt(router.currentRoute.value.query.page);
  sortPage.value = currentPage.value * pageSize.value - pageSize.value;
}
const { data: project, refresh } = await useFetch("/api/courses", {
  key: route.params.id,
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
const handleCurrentChange = (val) => {
  if (val == 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * pageSize.value - pageSize.value;
  }
  currentPage.value = val;
  router.replace({
    name: "catalog",
    query: {
      page: currentPage.value != 1 ? currentPage.value : undefined,
    },
  });
  // refresh();
  scrollToTop();
};
</script>

<template>
  <div class="bd-docs-main">
    <div class="container is-max-desktop">
      <div class="content">
        <!-- <Breadcrumb />
        <nav-category /> -->
        <div class="columns is-multiline">
          <div class="column is-9">
            <div class="catalog-parent" v-if="project.result != ''">
              <div
                v-for="item in project.result"
                :key="item._id"
                class="catalog-block"
              >
                <nuxt-link :to="`/course/` + item.kirilica">
                  <div class="catalog-block-img">
                    <NuxtImg
                      v-if="item.img.length > 0"
                      :src="item.img[0].url"
                      :alt="item.img[0].name"
                      format="wepb"
                    />
                    <NuxtImg v-else provider="aliyun" src="/noimg.webp" />
                  </div>
                  <div class="catalog-block-desc">
                    <strong>
                      {{ item.title }}
                    </strong>
                    <div class="catalog-block-desc-info">
                      <Icon name="solar:hourglass-broken" />
                      <span>{{ item.duration }}</span>
                    </div>
                    <div class="catalog-block-desc-info">
                      <Icon name="solar:earth-broken" />
                      <span>{{ item.language }}</span>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>

            <div v-else>no course</div>
          </div>
        </div>
        <el-pagination
          class="pagination-list"
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="project.count"
          :pager-count="4"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
