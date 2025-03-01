<script setup>
const commentText = ref("");
const isSubmitting = ref(false);
const comments = ref([]);
const props = defineProps(["kirilica"]);

// Получаем данные о пользователе через useAuth
const { data: user } = useAuth();
const isAuthenticated = computed(() => !!user?.value);

// Функция для отправки комментариев
const submitComment = async () => {
  if (!commentText.value.trim()) return;

  if (!isAuthenticated.value) {
    alert("Вы должны быть авторизованы для добавления комментариев!");
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch("/api/addcomment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        text: commentText.value,
        userId: user.value.user._id,
        userName: user.value.user.username,
        kirilica: props.kirilica,
      },
    });

    if (response.error) {
      alert(response.error);
    } else {
      commentText.value = ""; // Очищаем поле после успешного добавления
      loadComments(); // Перезагружаем комментарии
    }
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Функция для загрузки комментариев
const loadComments = async () => {
  try {
    const response = await $fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { kirilica: props.kirilica }, // Передаем kirilica
    });

    if (response.error) {
      console.error("Ошибка при загрузке комментариев:", response.error);
    } else {
      comments.value = response; // Сохраняем комментарии
    }
  } catch (error) {
    console.error("Ошибка при загрузке комментариев:", error);
  }
};

// Функция для удаления комментария
const deleteComment = async (commentId) => {
  if (!isAuthenticated.value) {
    alert("Вы должны быть авторизованы!");
    return;
  }

  try {
    const response = await $fetch("/api/delete/deletecomment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        commentId,
        userId: user.value.user._id, // Передаем id пользователя для проверки
      },
    });

    if (response.error) {
      alert(response.error);
    } else {
      loadComments(); // Обновляем список комментариев
    }
  } catch (error) {
    console.error("Ошибка при удалении комментария:", error);
  }
};

// Загружаем комментарии при монтировании компонента
onMounted(() => {
  loadComments();
});
</script>

<template>
  <div>
    <h4 class="comment-title">Комментарии:</h4>
    <div class="comment-block" v-if="comments.length">
      <div v-for="comment in comments" :key="comment._id" class="comment-item">
        <strong>{{ comment.userName }}</strong>
        <p>{{ comment.text }}</p>
        <div class="comment-button">
          <el-button
            v-if="isAuthenticated && comment.id_user === user?.user?._id"
            @click="deleteComment(comment._id)"
            type="danger"
            class="delete-b"
            circle
          >
            <Icon name="solar:trash-bin-2-broken" />
          </el-button>
        </div>
      </div>
    </div>

    <div class="comment-block" v-else>
      <p>Комментариев пока нет.</p>
    </div>

    <textarea
      v-model="commentText"
      class="textarea"
      placeholder="Ваш комментарий"
    ></textarea>
    <el-button
      type="info"
      class="c-b-send"
      :disabled="isSubmitting || commentText.length < 3"
      @click="submitComment"
    >
      {{ isSubmitting ? "Отправка..." : "Комментировать" }}
    </el-button>
  </div>
</template>
