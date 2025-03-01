<script setup>
const route = useRoute();
const router = useRouter();
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);

const fillArr = ref([]);
const checked = ref([]);
const queryFill = ref("");
const tagCatalog = ref([{}]);
const mobileScin = ref(true);
const visibleDrawer = ref(false);
const nameCatValue = ref("");

const { data: filter } = await useFetch("/api/filtercat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { FilterCat: route.params.id },
});

const groupedData = ref({});

filter.value.forEach((item) => {
  const type = item.type;

  if (!groupedData.value[type]) {
    groupedData.value[type] = [];
  }

  groupedData.value[type].push(item);
});

const fiilTaf = (filter, tag) => {
  tagCatalog.value = [];
  for (let item in filter) {
    for (let arrin in tag) {
      if (tag[arrin] == filter[item]["kirilica"])
        tagCatalog.value.push({
          name: filter[item]["name"],
          kirilica: filter[item]["kirilica"],
        });
    }
  }
};

if (router.currentRoute.value.query.filter != undefined) {
  fillArr.value = router.currentRoute.value.query.filter.split(",");
  queryFill.value = JSON.parse(JSON.stringify(fillArr.value)).join(",");
  checked.value = fillArr.value;
  fiilTaf(filter.value, fillArr.value);
}
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
  body: {
    ParamsCatChild: route.params.id,
    filter: fillArr,
    sortPage,
    pageSize,
    FilterArr: filter.value,
  },
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
    name: "catalog-child-id",
    query: {
      filter: queryFill.value ? queryFill.value : undefined,
      page: currentPage.value != 1 ? currentPage.value : undefined,
    },
  });
  //refresh();
  scrollToTop();
};

const handleChecked = (val) => {
  fillArr.value = val;
  queryFill.value = JSON.parse(JSON.stringify(val)).join(",");
  fiilTaf(filter.value, val);
  router.replace({
    name: "catalog-child-id",
    query: {
      filter: queryFill.value ? queryFill.value : undefined,
      page: currentPage.value != 1 ? currentPage.value : undefined,
    },
  });
  //refresh();
};
const handleClose = (tag) => {
  fillArr.value.splice(fillArr.value.indexOf(tag), 1);
  fiilTaf(filter.value, fillArr.value);
  queryFill.value = JSON.parse(JSON.stringify(fillArr.value)).join(",");
  router.replace({
    name: "catalog-child-id",
    query: {
      filter: queryFill.value ? queryFill.value : undefined,
      page: undefined,
    },
  });
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
const nameCat = (item) => {
  nameCatValue.value = item;
};
</script>

<template>
  <div>
    <div class="bd-docs-main">
      <div class="container is-max-desktop">
        <div class="content">
          <div class="breadcrumb-catalog">
            <Breadcrumb @nameCategory="nameCat" />
          </div>
          <h1 class="h1-catalog">{{ nameCatValue }}</h1>
          <div class="mobail-filter" v-if="mobileScin == false">
            <button
              class="button button-meny is-light"
              @click="visibleDrawer = !visibleDrawer"
            >
              <span class="icon is-small">
                <Icon name="solar:tuning-square-2-broken" />
              </span>
              <span class="none-meny">Фильтр</span>
            </button>
            <ClientOnly>
              <el-drawer
                v-model="visibleDrawer"
                class="meny-nav-cat mobail-nav drawer-fill"
              >
                <div class="post-top-item">
                  <el-checkbox-group v-model="checked" @change="handleChecked">
                    <div v-for="(group, type) in groupedData" :key="type">
                      <div v-if="group.length > 0" class="check-type-name">
                        <strong>{{ type }}</strong>
                        <div
                          v-for="item in group"
                          :key="item.kirilica"
                          class="check-type-name"
                        >
                          <el-checkbox :label="item.kirilica">{{
                            item.name
                          }}</el-checkbox>
                        </div>
                      </div>
                    </div>
                  </el-checkbox-group>
                </div>
              </el-drawer>
            </ClientOnly>
          </div>
          <div class="tag-catalog">
            <el-tag
              v-show="checked.length"
              class="mr-2"
              type="info"
              v-for="tag in tagCatalog"
              :key="tag.kirilica"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
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
            <div class="column is-3" v-if="mobileScin == true">
              <div class="post-top">
                <div class="post-top-item">
                  <el-checkbox-group v-model="checked" @change="handleChecked">
                    <div v-for="(group, type) in groupedData" :key="type">
                      <div v-if="group.length > 0" class="check-type-name">
                        <strong>{{ type }}</strong>
                        <div
                          v-for="item in group"
                          :key="item.kirilica"
                          class="check-type-name"
                        >
                          <el-checkbox :label="item.kirilica">{{
                            item.name
                          }}</el-checkbox>
                        </div>
                      </div>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
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
  </div>
</template>
