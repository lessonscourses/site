<script setup>
const props = defineProps({
  namecourse: {
    type: String,
    default: "",
  },
  status: {
    type: Boolean,
    default: "",
  },
});
const visible = ref(false);
const plyr = ref("");
const lessonName = ref("");
const drawer = ref(false);
const arrSwiper = ref([]);
const statusUser = ref(props.status);

const activeLesson = ref({
  title: "",
  time: "",
});
const { data: lessons } = await useFetch("/api/lesson/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { Course: props.namecourse },
});

const SlideChange = (swiper) => {
  arrSwiper.value = swiper.clickedSlide.children[0].attributes[0].nodeValue;
  arrSwiper.value = JSON.parse(arrSwiper.value);
  activeLesson.value.title = arrSwiper.value.name;
  activeLesson.value.time = arrSwiper.value.time;
  lesson(arrSwiper.value.link_video);
};
const lesson = async (item) => {
  if (statusUser.value === false) {
    lessonName.value = "https://cloud.weboko.net/wavesSea.mp4";
  } else {
    if (item == undefined) {
      lessonName.value = "https://cloud.weboko.net/wavesSea.mp4";
    } else {
      lessonName.value = item;
    }
  }
  await reloadPlyrComponent(); // Перерендерить компонент
};
const reloadPlyrComponent = async () => {
  visible.value = false;
  await nextTick(); // Дождаться обновления DOM
  visible.value = true;
};
const handleMouseEnter = (item) => {
  lesson(item.link_video);
  activeLesson.value.title = item.name;
  activeLesson.value.time = item.time;
  lessons.value.forEach((i) => (i.active = false));
  item.active = true;
};

const handleMouseEnterSlide = (item) => {
  lessons.value.forEach((i) => (i.active = false));
  item.active = true;
};

const seastatus = () => {
  if (statusUser.value === false) {
    lessonName.value = "https://cloud.weboko.net/wavesSea.mp4";
    activeLesson.value.title = lessons.value[0].name;
    activeLesson.value.time = lessons.value[0].time;
  } else {
    if (lessons.value.length > 0) {
      lessonName.value = lessons.value[0].link_video;
      activeLesson.value.title = lessons.value[0].name;
      activeLesson.value.time = lessons.value[0].time;
      lessons.value[0].active = true;
      if (lessons.value[0].link_video == undefined) {
        lessonName.value = "https://cloud.weboko.net/wavesSea.mp4";
      }
    } else {
      lessonName.value = "https://cloud.weboko.net/wavesSea.mp4";
    }
  }
  visible.value = true;
};
seastatus();
</script>
<template>
  <div>
    <ClientOnly>
      <div class="video-item-project">
        <div v-if="visible == true" class="video-item-project-first">
          <video controls>
            <source :src="lessonName" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div v-if="statusUser == false" class="plyr-pay">
            <nuxt-link class="button is-primary" to="/pricing"
              >К тарифам</nuxt-link
            >
          </div>
        </div>
        <div v-else>no video</div>

        <div>
          <div class="video-item-project-title">
            <div class="video-item-project-title-info">
              <strong>{{ activeLesson.title }}</strong>
              <span
                ><Icon name="solar:clock-square-broken" />{{
                  activeLesson.time
                }}</span
              >
            </div>
            <button
              class="button is-dark"
              style="margin-left: 16px"
              @click="drawer = true"
            >
              Все уроки
            </button>
          </div>
        </div>
        <div class="video-item-project-list">
          <Swiper
            :space-between="20"
            :modules="[
              SwiperEffectCreative,
              SwiperNavigation,
              SwiperPagination,
              SwiperA11y,
              SwiperMousewheel,
            ]"
            @click="SlideChange"
            :loop="false"
            :navigation="{
              next: true,
              prev: true,
            }"
            :creative-effect="{
              prev: {
                shadow: false,
                translate: ['-20%', 0, -1],
              },
              next: {
                translate: ['100%', 0, 0],
              },
            }"
            :breakpoints="{
              300: {
                slidesPerView: 1.5,
              },
              680: {
                slidesPerView: 1.5,
              },
              1650: {
                slidesPerView: 3,
              },
            }"
          >
            <SwiperSlide v-for="item in lessons" :key="item">
              <div
                v-bind:item-identity="JSON.stringify(item)"
                class="video-project-list-el"
                @click="handleMouseEnterSlide(item)"
              >
                <div
                  class="video-project-list-info"
                  :class="{ 'video-project-active': item.active }"
                >
                  <strong>{{ item.lesson_number }}</strong>
                  <span
                    ><Icon name="solar:clock-square-broken" />{{
                      item.time
                    }}</span
                  >
                  <p>{{ item.name }}</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <el-drawer
        v-model="drawer"
        class="drawel-all-lesson"
        title="I am the title"
        :with-header="false"
      >
        <div v-for="item in lessons" :key="item">
          <div class="video-project-list-el drawer-lesson">
            <div
              @click="handleMouseEnter(item)"
              class="video-project-list-info"
              :class="{ 'video-project-active': item.active }"
            >
              <strong>{{ item.lesson_number }}</strong>
              <span
                ><Icon name="solar:clock-square-broken" />{{ item.time }}</span
              >
              <p>{{ item.name }}</p>
            </div>
          </div>
        </div>
      </el-drawer>
    </ClientOnly>
  </div>
</template>
