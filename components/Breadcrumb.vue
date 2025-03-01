<script setup>
const props = defineProps({
  courseCategorychild: {
    type: String,
    default: "",
  },
  courseCategory: {
    type: String,
    default: "",
  },
  courseName: {
    type: String,
    default: "",
  },
  courseLink: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["nameCategory"]);

const route = useRoute();
const pathName = ref("");
const pathNameParent = ref("");
const pathLink = ref("");
const pathLinkParent = ref("");
const router = useRouter();
const category = ref("");
const pathCourseLink = ref("");
const pathCourseName = ref("");

if (router.currentRoute.value.name == "catalog-id") {
  const { data } = await useFetch("/api/category/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  category.value = data.value;
} else if (router.currentRoute.value.name == "catalog-child-id") {
  const { data } = await useFetch("/api/childcategory/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  category.value = data.value;
} else if (router.currentRoute.value.name == "course-id") {
  pathLinkParent.value = props.courseCategory;
  pathName.value = props.courseCategorychild;
  pathNameParent.value = props.courseCategory;
  pathCourseName.value = props.courseName;
  pathCourseLink.value = props.courseLink;
  pathLink.value =
    "/catalog/" + pathLinkParent.value + "/" + props.courseCategorychild;
}

if (route.params.id != "/" && route.params.id != undefined) {
  for (let item in category) {
    for (let iteminArr in category[item]) {
      if (
        category &&
        category[item] &&
        category[item][iteminArr] &&
        category[item][iteminArr]["kirilica"] != "" &&
        category[item][iteminArr]["kirilica"] == route.params.id
      ) {
        pathName.value = category[item][iteminArr]["name"];
        pathLink.value = category[item][iteminArr]["kirilica"];
        if (router.currentRoute.value.name == "catalog-child-id") {
          pathNameParent.value = category[item][iteminArr]["category"];
          pathNameParent.value =
            pathNameParent.value.charAt(0).toUpperCase() +
            pathNameParent.value.slice(1);
          pathLinkParent.value = category[item][iteminArr]["category"];
        }
        emit("nameCategory", pathName.value);
      }
    }
  }
} else {
  //   pathName.value = "Выполненные проекты";
  //   pathLink.value = "/catalog";
}
</script>

<template>
  <div>
    <div class="breadcrumb-item">
      <nuxt-link to="/">Главная</nuxt-link><b>/</b>
      <nuxt-link v-if="pathNameParent" :to="'/catalog/' + pathLinkParent">{{
        pathNameParent
      }}</nuxt-link
      ><b v-if="pathNameParent">/</b>
      <nuxt-link :to="pathLink">{{ pathName }}</nuxt-link>
      <b v-if="pathCourseName">/</b>
      <nuxt-link v-if="pathCourseName" :to="'/course/' + pathCourseLink">{{
        pathCourseName
      }}</nuxt-link>
    </div>
  </div>
</template>
