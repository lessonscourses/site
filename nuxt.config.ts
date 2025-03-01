// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    bdurl: process.env.DATABASE_URL,
    dbName: process.env.DBNAME,
    user: process.env.DBUSERNAME,
    pass: process.env.DBPASSWORD,
    authSource: process.env.DBAUTHSOURCE,
    authSecret: process.env.AUTH_SECRET,
    mongodbUri: process.env.DATABASE_URL,
    MAILHOST: process.env.MAILHOST,
    MAILPORT: process.env.MAILPORT,
    MAILUSER: process.env.MAILUSER,
    MAILPASSWORD: process.env.MAILPASSWORD,
    CONTACTMAIL: process.env.CONTACTMAIL,
  },
  app: {
    head: {
      title: "WebOko - Обучающие web курсы",
      htmlAttrs: {
        lang: "ru",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        { charset: "utf-8" },
        { name: "yandex-verification", content: "" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Онлайн курсы по веб разработке по низким ценам.",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "WebOko - Обучающие web курсы",
        },
        {
          hid: "og:description",
          property: "og:description",
          content: "Онлайн курсы по веб разработке по низким ценам.",
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `https://weboko.net`,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: `https://weboko.net/nuxt-imf.webp`,
        },
        {
          hid: "og:locale",
          property: "og:locale",
          content: "ru_RU",
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "website",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  modules: [
    "nuxt-server-utils",
    "@sidebase/nuxt-auth",
    "nuxt-icon",
    "@element-plus/nuxt",
    "@nuxt/image-edge",
    "@nuxt/image",
    "nuxt-aos",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-swiper",
    "@vue-email/nuxt",
    "@nuxt/content",
    "@hypernym/nuxt-anime",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Montserrat: [100, 300, 400, 500, 600, 700, 800],
          download: true,
          inject: true,
        },
      },
    ],
    [
      "yandex-metrika-module-nuxt3",
      {
        id: "",
        webvisor: true,
      },
    ],
    [
      "@vee-validate/nuxt",
      {
        // disable or enable auto imports
        autoImports: true,
        // Use different names for components
        componentNames: {
          Form: "VeeForm",
          Field: "VeeField",
          FieldArray: "VeeFieldArray",
          ErrorMessage: "VeeErrorMessage",
        },
      },
    ],
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: "strict",
    },
    storage: "localStorage",
  },
  image: {
    aliyun: {
      baseURL: "https://disk.weboko.net/",
      //baseURL: "http://localhost:3000",
    },
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },
  css: [
    "@/node_modules/bulma/css/bulma.css",
    "@/assets/main.css",
    // "@/node_modules/plyr/dist/plyr.css",
  ],
  devtools: { enabled: true },
  nitro: {
    plugins: ["~/server/index.ts"],
    // devProxy: {
    //   "/images": {
    //     target: "https://disk.cryptoscool.ru/images/",
    //     changeOrigin: true,
    //   },
    // },
  },
});
