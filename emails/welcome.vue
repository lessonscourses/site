<script setup>
defineProps({
  userFirstname: {
    type: String,
    default: "John",
  },
  url: {
    type: String,
    default: "",
  },
});

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center",
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
</script>

<template>
  <EHtml>
    <EHead />
    <EPreview> Письмо от Weboko. </EPreview>
    <EBody :style="main">
      <EContainer :style="container">
        <EText :style="paragraph"> Здравствуйте {{ userFirstname }}, </EText>
        <EText :style="paragraph">
          Благодарим за регистрацию на портале Weboko
        </EText>
        <EText :style="paragraph">
          Для успешного прохождения обучения необходимо верифицировать аккаунт.
        </EText>
        <ESection :style="btnContainer">
          <EButton px="12" py="12" :style="button" :href="url">
            Верифицировать аккаунт
          </EButton>
        </ESection>
        <EText :style="paragraph"> The Weboko team </EText>
        <EHr :style="hr" />
      </EContainer>
    </EBody>
  </EHtml>
</template>
