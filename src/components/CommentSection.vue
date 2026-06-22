<template>
  <div class="comments-section">
    <h3 class="comments-title">💬 Comments ({{ comments.length }})</h3>

    <!-- Comment Form — Only for authenticated users -->
    <div v-if="isAuthenticated" class="comment-form-wrapper">
      <form @submit.prevent="handleSubmit" class="comment-form">
        <textarea
          id="comment-input"
          v-model="newComment"
          placeholder="Write your comment..."
          rows="3"
          :disabled="isSubmitting"
          required
        ></textarea>
        <button type="submit" :disabled="isSubmitting || !newComment.trim()" class="btn-submit">
          {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
        </button>
      </form>
      <p v-if="submitError" class="error-text">{{ submitError }}</p>
    </div>

    <!-- Prompt for unauthenticated users -->
    <div v-else class="login-prompt">
      <p>🔒 <router-link to="/login">Log in</router-link> to leave a comment.</p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="status-message">
      <p>Loading comments...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="loadError" class="error-text">
      {{ loadError }}
    </div>

    <!-- Empty state -->
    <div v-else-if="comments.length === 0" class="empty-comments">
      <p>No comments yet. Be the first to share your thoughts!</p>
    </div>

    <!-- Comments list -->
    <div v-else class="comments-list">
      <div v-for="item in comments" :key="item._id" class="comment-card">
        <div class="comment-header">
          <span class="comment-author">{{ item.userId?.name || 'Anonymous' }}</span>
          <span class="comment-date">{{ formatDate(item.dateAdded) }}</span>
        </div>
        <p class="comment-body">{{ item.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { postService } from '../services/postService';
import { authService } from '../services/authService';

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
});

// State
const comments = ref([]);
const newComment = ref('');
const isLoading = ref(true);
const isSubmitting = ref(false);
const loadError = ref('');
const submitError = ref('');

// Check auth reactively
const isAuthenticated = authService.currentUser;

// Fetch all comments for this post
const fetchComments = async () => {
  try {
    isLoading.value = true;
    loadError.value = '';
    const data = await postService.getComments(props.postId);
    comments.value = data.comments || [];
  } catch (error) {
    console.error('Failed to load comments:', error);
    loadError.value = 'Failed to load comments.';
  } finally {
    isLoading.value = false;
  }
};

// Submit a new comment
const handleSubmit = async () => {
  if (!newComment.value.trim()) return;

  try {
    isSubmitting.value = true;
    submitError.value = '';

    const data = await postService.addComment(props.postId, {
      comment: newComment.value.trim(),
    });

    // Add the new comment to the top of the list
    if (data.comment) {
      comments.value.unshift(data.comment);
    }

    newComment.value = '';
  } catch (error) {
    console.error('Failed to post comment:', error);
    submitError.value = error.response?.data?.message || 'Failed to post comment. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(() => {
  fetchComments();
});
</script>

<style scoped>
.comments-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.comments-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #111;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.comment-form textarea {
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  resize: vertical;
  font-family: inherit;
  background: #fff;
  color: var(--text);
}

.comment-form textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(47, 123, 60, 0.12);
}

.btn-submit {
  align-self: flex-end;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  cursor: pointer;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 999px;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--accent-dark);
}

.btn-submit:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.login-prompt {
  padding: 1.2rem;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.login-prompt a {
  color: var(--accent-dark);
  font-weight: 700;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-card {
  padding: 1.25rem;
  background-color: #fff;
  border: 1px solid var(--border);
  border-radius: 18px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.comment-author {
  font-weight: 700;
  color: var(--text);
}

.comment-date {
  font-size: 0.88rem;
  color: var(--muted);
}

.comment-body {
  margin: 0;
  line-height: 1.75;
  color: #333;
}

.error-text {
  color: var(--danger);
  margin-bottom: 0.75rem;
}

.empty-comments {
  text-align: center;
  color: var(--muted);
  padding: 1.5rem;
  font-style: italic;
}
</style>
