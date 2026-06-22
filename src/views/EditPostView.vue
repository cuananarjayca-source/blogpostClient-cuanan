<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { postService } from '../services/postService';

const route = useRoute();
const router = useRouter();
const postId = route.params.id;

// Input fields matching database schema requirements
const title = ref('');
const content = ref('');

// Operational state flags
const isLoading = ref(true);
const isUpdating = ref(false);
const errorMessage = ref('');

// Fetch the existing post details to pre-populate the form
const fetchPostDetails = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Hits your exact route: router.get('/getPostById/:id', getPostById);
    const post = await postService.getPostById(postId);
    
    if (post) {
      title.value = post.title;
      content.value = post.content;
    }
  } catch (error) {
    console.error('❌ Failed to fetch post detail data:', error);
    errorMessage.value = 'Could not load the requested blog post details.';
  } finally {
    isLoading.value = false;
  }
};

// Handle submitting the edited changes
const handleUpdatePost = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    errorMessage.value = 'Title and content cannot be blank.';
    return;
  }

  try {
    isUpdating.value = true;
    errorMessage.value = '';

    // Hits your backend route: router.patch('/updatePost/:id', protect, updatePost);
    await postService.updatePost(postId, {
      title: title.value,
      content: content.value
    });

    console.log('✅ Post modifications saved successfully via PATCH request!');
    
    // Redirect back to home feed dashboard
    router.push('/');
  } catch (error) {
    console.error('❌ Update operation rejected:', error);
    errorMessage.value = error.response?.data?.message || 'Unauthorized: You are not permitted to edit this post.';
  } finally {
    isUpdating.value = false;
  }
};

// Pre-load data automatically on initialization
onMounted(fetchPostDetails);
</script>

<template>
  <div class="edit-post-wrapper">
    <h2>Edit Story</h2>

    <div v-if="isLoading" class="loading-status">
      <p>Loading your story details from database...</p>
    </div>

    <div v-else-if="errorMessage" class="error-text form-error">
      {{ errorMessage }}
      <button @click="router.push('/')" class="btn-cancel" type="button">Back to Feed</button>
    </div>

    <form v-else @submit.prevent="handleUpdatePost">
      <div class="form-field">
        <label for="title">Update Title:</label>
        <input 
          id="title"
          v-model="title" 
          type="text" 
          required 
          :disabled="isUpdating"
        />
      </div>

      <div class="form-field">
        <label for="content">Update Content:</label>
        <textarea 
          id="content"
          v-model="content" 
          rows="8"
          required 
          :disabled="isUpdating"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isUpdating">
          {{ isUpdating ? 'Saving Changes...' : 'Save Changes' }}
        </button>
        <button type="button" class="btn-cancel" @click="router.push('/')" :disabled="isUpdating">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>