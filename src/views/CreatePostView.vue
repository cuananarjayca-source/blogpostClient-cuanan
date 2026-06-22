<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { postService } from '../services/postService';

const router = useRouter();

// Input states matching schema fields
const title = ref('');
const content = ref('');

// Operational state trackers
const errorMessage = ref('');
const isLoading = ref(false);

const handleCreatePost = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    errorMessage.value = 'Title and content cannot be blank.';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';

    await postService.createPost({
      title: title.value,
      content: content.value
    });

    console.log('✅ Post successfully added to MongoDB!');
    
    router.push('/');
  } catch (error) {
    console.error('❌ Failed to create post:', error);
    errorMessage.value = error.response?.data?.message || 'Unauthorized: Only signed-in members can publish stories.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="create-post-wrapper">
    <h2>Write a New Story</h2>
    
    <form @submit.prevent="handleCreatePost">
      <div v-if="errorMessage" class="error-text form-error">
        {{ errorMessage }}
      </div>

      <div class="form-field">
        <label for="title">Post Title:</label>
        <input 
          id="title"
          v-model="title" 
          type="text" 
          placeholder="Give your story an engaging title..."
          required 
          :disabled="isLoading"
        />
      </div>

      <div class="form-field">
        <label for="content">Story Content:</label>
        <textarea 
          id="content"
          v-model="content" 
          rows="8"
          placeholder="What's on your mind? Start writing here..."
          required 
          :disabled="isLoading"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Publishing Story...' : 'Publish Post' }}
        </button>
        <button type="button" class="btn-cancel" @click="router.push('/')" :disabled="isLoading">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>