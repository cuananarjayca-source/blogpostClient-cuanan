<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { postService } from '../services/postService';
import CommentSection from '../components/CommentSection.vue';

const route = useRoute();
const router = useRouter();

const post = ref(null);
const isLoading = ref(true);
const errorMessage = ref('');

const fetchPost = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';

    const data = await postService.getPostById(route.params.id);
    post.value = data;
  } catch (error) {
    console.error('Failed to load post:', error);
    errorMessage.value = 'Failed to load this post.';
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchPost();
});
</script>

<template>
  <div class="post-detail-wrapper">
    <!-- Loading state -->
    <div v-if="isLoading" class="status-message">
      <p>Loading post...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="errorMessage" class="error-banner">
      <p>{{ errorMessage }}</p>
      <button @click="router.push('/')" class="btn-back">← Back to Home</button>
    </div>

    <!-- Post content -->
    <article v-else-if="post" class="post-article">
      <button @click="router.push('/')" class="btn-back">← Back to Home</button>

      <h1 class="post-title">{{ post.title }}</h1>

      <div class="post-meta">
        <span>By {{ post.author?.name || 'Community Member' }}</span>
        <span>•</span>
        <span>{{ formatDate(post.dateAdded) }}</span>
      </div>

      <div class="post-content">
        <p>{{ post.content }}</p>
      </div>

      <!-- Comment Section -->
      <CommentSection :postId="route.params.id" />
    </article>
  </div>
</template>

<style scoped>
.post-detail-wrapper {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
}

.btn-back {
  background: none;
  border: 1px solid #ccc;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.9rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.btn-back:hover {
  background-color: #f5f5f5;
}

.post-title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.post-meta {
  display: flex;
  gap: 0.5rem;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.post-content {
  line-height: 1.75;
  font-size: 1.05rem;
  color: #333;
}

.status-message {
  text-align: center;
  padding: 3rem;
  color: #888;
}

.error-banner {
  text-align: center;
  padding: 2rem;
  color: red;
}
</style>