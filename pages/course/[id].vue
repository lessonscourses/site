<script setup>
const route = useRoute();
const statusUser = ref(false);
const isTextVisible = ref(false);
const { data: user } = useAuth();

if (user.value) {
  const { data: userData } = await useFetch(() => "/api/user/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: user.value.user._id,
  });
  statusUser.value = userData.value[0][0].status;
} else {
  statusUser.value = false;
}

const { data: course } = useFetch(() => "/api/course/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: route.params.id,
});

// Функция переключения видимости
const toggleText = () => {
  isTextVisible.value = !isTextVisible.value;
};

// Функция очистки текста (Только для расчёта длины!)
const cleanText = (text) => {
  if (!text) return "";
  const textWithoutHtml = text.replace(/<[^>]*>/g, ""); // Убираем HTML-теги
  return textWithoutHtml.replace(/\s/g, ""); // Убираем пробелы
};

// Проверяем, нужно ли обрезать текст
const shouldShowButton = computed(() => {
  return (text) => cleanText(text).length > 300;
});

// Обрезка текста, но без удаления HTML (отображается оригинал)
const trimmedText = computed(() => {
  return (text) => {
    if (!text) return "";
    const cleanTextContent = cleanText(text);
    if (isTextVisible.value || cleanTextContent.length <= 300) {
      return text; // Показываем оригинал, если можно
    }

    let index = 0;
    let count = 0;

    while (index < text.length && count < 300) {
      if (!text[index].match(/\s/)) count++; // Считаем символы без пробелов
      index++;
    }

    return text.slice(0, index) + "..."; // Обрезаем и оставляем HTML
  };
});
</script>

<template>
  <div>
    <div class="bd-docs-main">
      <div class="container is-max-desktop">
        <div v-for="item in course" :key="item">
          <div class="content">
            <div class="breadcrumb-catalog">
              <Breadcrumb
                :courseCategory="item.category"
                :courseCategorychild="item.categorychild"
                :courseName="item.title"
                :courseLink="item.kirilica"
              />
            </div>
            <div class="back" @click="$router.back()">
              <Icon name="solar:round-alt-arrow-left-broken" />
              <strong>Назад</strong>
            </div>
            <h1 class="h1-project">{{ item.title }}</h1>
            <div class="cours-star">
              <el-rate
                v-model="item.raiting"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
              />
            </div>
            <div class="course-block">
              <div class="course-item">
                {{ item.preview }}
              </div>
              <div class="course-full">
                <div class="course-full-info">
                  <Icon name="solar:hourglass-broken" />
                  <div class="course-full-info-text">
                    <strong>Продолжительность</strong>
                    <span>{{ item.duration }}</span>
                  </div>
                </div>
                <div class="course-full-info">
                  <Icon name="solar:checklist-minimalistic-broken" />
                  <div class="course-full-info-text">
                    <strong>Количество уроков</strong>
                    <span>{{ item.number_of_lessons }}</span>
                  </div>
                </div>
                <div class="course-full-info">
                  <Icon name="solar:calendar-broken" />
                  <div class="course-full-info-text">
                    <strong>Дата выхода</strong>
                    <span>{{ item.release_date }}</span>
                  </div>
                </div>
                <div class="course-full-info">
                  <Icon name="solar:earth-broken" />
                  <div class="course-full-info-text">
                    <strong>Язык</strong>
                    <span>{{ item.language }}</span>
                  </div>
                </div>
              </div>
              <div class="project-video">
                <CourseVideo :namecourse="item.kirilica" :status="statusUser" />
              </div>
            </div>
            <div class="columns">
              <div class="column is-12">
                <div class="project-block-desc">
                  <transition name="el-fade-in-linear">
                    <div
                      v-html="trimmedText(item.description)"
                      class="description-course"
                    ></div>
                  </transition>
                  <el-link
                    v-if="shouldShowButton(item.description)"
                    @click="toggleText"
                    :underline="false"
                    type="info"
                    ><Icon
                      :name="
                        isTextVisible
                          ? 'solar:round-alt-arrow-up-broken'
                          : 'solar:round-alt-arrow-down-broken'
                      "
                    />&nbsp;
                    {{ isTextVisible ? "Скрыть" : "Всё описание" }}</el-link
                  >
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-12">
                <CourseComment :kirilica="item.kirilica" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.description {
  max-height: 200px;
  overflow: hidden;
  transition: max-height 0.5s ease; /* добавляем анимацию */
}

.el-fade-in-linear-enter-active,
.el-fade-in-linear-leave-active {
  transition: opacity 0.5s;
}

.el-fade-in-linear-enter,
.el-fade-in-linear-leave-to {
  opacity: 0;
}
</style>
