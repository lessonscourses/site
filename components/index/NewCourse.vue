<script setup>
const arrSwiper = ref([]);
const { data: course } = useFetch(() => "/api/newcourse/", {
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
      <div class="columns is-multiline">
        <div class="column is-12">
          <h4><icon name="solar:video-library-outline" />Новинки</h4>
        </div>
        <div class="column is-12">
          <div class="new-slide">
            <Swiper
              :height="100"
              :space-between="25"
              @click="slideLink"
              :modules="[
                SwiperAutoplay,
                SwiperEffectCreative,
                SwiperNavigation,
                SwiperPagination,
              ]"
              :navigation="{
                next: true,
                prev: true,
              }"
              :slides-per-view="1.5"
              :loop="false"
              :autoplay="{
                delay: 70000,
                disableOnInteraction: true,
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
                  slidesPerView: 3,
                },
                1650: {
                  slidesPerView: 4,
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
                  class="new-slide-item"
                >
                  <div class="new-slide-item-img">
                    <NuxtImg
                      v-if="slide.img.length > 0"
                      :src="slide.img[0].url"
                      :alt="slide.img[0].name"
                      format="wepb"
                    />
                    <NuxtImg v-else provider="aliyun" src="/noimg.webp" />
                  </div>
                  <div class="new-slide-info">
                    <Icon name="solar:slash-square-broken" />
                    <span>FrontEnd</span>
                  </div>
                  <div class="new-slide-title">
                    <strong>{{ slide.title }}</strong>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
