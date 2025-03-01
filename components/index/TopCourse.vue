<script setup>
const arrSwiper = ref([]);
const { data: course } = useFetch(() => "/api/topcourse/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const slideLink = (swiper) => {
  arrSwiper.value = JSON.parse(
    swiper.clickedSlide.children[0].attributes[0].nodeValue
  );
  navigateTo("/course/" + arrSwiper.value);
};
</script>
<template>
  <div>
    <div data-aos="fade-up" data-aos-delay="300" data-aos-once="true">
      <h4><Icon name="solar:heart-angle-broken" />Топ курсы</h4>
      <div class="index-project-info">
        <p>Выполненные и успешно работающие наши работы.</p>
        <div class="index-project-slider">
          <Swiper
            :height="300"
            :spaceBetween="40"
            :slides-per-view="1.5"
            @click="slideLink"
            :modules="[
              SwiperAutoplay,
              SwiperEffectCreative,
              SwiperNavigation,
              SwiperPagination,
            ]"
            :loop="true"
            :effect="'creative'"
            :creative-effect="{
              prev: {
                shadow: false,
                translate: [0, 0, -400],
              },
              next: {
                translate: ['100%', 0, 0],
              },
            }"
            :autoplay="{
              delay: 70000,
              disableOnInteraction: true,
            }"
            :breakpoints="{
              300: {
                slidesPerView: 1,
              },
              680: {
                slidesPerView: 1,
              },
              1650: {
                slidesPerView: 1.5,
              },
            }"
          >
            <SwiperSlide
              v-for="slide in course"
              :key="slide"
              :pagination="{ clickable: true, dynamicBullets: true }"
            >
              <div
                v-bind:item-identity="JSON.stringify(slide.kirilica)"
                class="project-slid"
              >
                <div class="project-slid-img">
                  <NuxtImg
                    v-if="slide.img.length > 0"
                    :src="slide.img[0].url"
                    :alt="slide.img[0].name"
                    format="wepb"
                  />
                  <NuxtImg v-else provider="aliyun" src="/noimg.webp" />
                </div>
                <div class="project-slid-desc">
                  <div>
                    <!-- <ClientOnly>
                      <nuxt-link
                        class="slid-desc-link"
                        @click.prevent="openInNewTab(slide.link)"
                        ><Icon name="solar:square-top-down-broken" /></nuxt-link
                    ></ClientOnly> -->
                    <strong>{{ slide.title }}</strong>
                    <p>
                      <Icon name="solar:siderbar-broken" />{{ slide.category }}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  </div>
</template>
