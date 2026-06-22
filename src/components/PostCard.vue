<template>
    <div class="post-card">
        <h2>{{ post.title }}</h2>
        <p class="meta">
            By {{ post.author?.name || 'Community Member' }} | {{ post.dateAdded ? new Date(post.dateAdded).toLocaleDateString() : 'Just Now' }}
        </p>
        <p class="snippet">{{ truncateContent(post.content) }}</p>

        <div class="card-actions">
            <router-link :to="`/posts/${post._id}`" class="btn-read"> Read More </router-link>

            <router-link v-if="isAuthor" :to="`/edit/${post._id}`" class="btn-edit"> Edit </router-link>

            <button v-if="canDelete" @click="$emit('delete-post', post._id)" class="btn-delete">
                Delete
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { authService } from '../services/authService';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete-post']);

const currentUser = computed(() => authService.currentUser.value);

// 2. SAFE CHECK: Extracts the ID whether 'author' is a populated object OR a plain string
const postAuthorId = computed(() => {
  if (!props.post.author) return null;
  return props.post.author._id || props.post.author;
});

const isAuthor = computed(() => {
  if (!currentUser.value || !postAuthorId.value) return false;
  // 3. Ensure both IDs are strings when comparing them
  const currentUserId = currentUser.value.id || currentUser.value._id;
  return String(currentUserId) === String(postAuthorId.value);
});

const isAdmin = computed(() => currentUser.value?.role === 'admin');
const canDelete = computed(() => isAuthor.value || isAdmin.value);

const truncateContent = (text) => {
  if (!text) return '';
  return text.length > 150 ? text.substring(0, 150) + '...' : text;
};
</script>
