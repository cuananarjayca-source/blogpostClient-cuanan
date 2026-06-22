<template>
  <div class="home-container">
    <header class="feed-header">
      <h1>Latest Stories</h1>
      <button @click="fetchPosts" class="btn-refresh" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : '🔄 Refresh' }}
      </button>
    </header>

    <div v-if="isLoading && posts.length === 0" class="status-message">
      <p>Loading the latest updates...</p>
    </div>

    <div v-else-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <div v-else-if="posts.length === 0" class="empty-state">
      <h3>No posts found</h3>
      <p>Be the first to publish a new story! Click "+ New Post" above to begin.</p>
    </div>

    <div v-else class="posts-grid">
      <PostCard 
        v-for="item in posts" 
        :key="item._id" 
        :post="item" 
        @delete-post="handleDeletePost"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { postService } from '../services/postService';
import { authService } from '../services/authService';
import PostCard from '../components/PostCard.vue';

const posts = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const currentUser = computed(() => authService.currentUser.value);

const fetchPosts = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    console.log("🚀 HTTP Request Sent to /posts/getAllPosts...");
    const responseData = await postService.getAllPosts();
    
    // 🔍 Hard Debug: Let's force an alert window to show us what the server returned
    console.log("📦 SERVER RAW RESPONSE:", responseData);
    
    // Fallback checking: If responseData is an object wrapping an array, unwrap it dynamically
    if (responseData && Array.isArray(responseData)) {
      posts.value = responseData;
    } else if (responseData && Array.isArray(responseData.posts)) {
      posts.value = responseData.posts;
    } else if (responseData && Array.isArray(responseData.post)) {
      posts.value = responseData.post;
    } else if (responseData && Array.isArray(responseData.data)) {
      posts.value = responseData.data;
    } else {
      posts.value = [];
    }
    
    console.log("✅ Reactive Posts array successfully loaded with:", posts.value.length, "items.");
  } catch (error) {
    errorMessage.value = 'Failed to load blog posts.';
    console.error("❌ CRITICAL NETWORK ERROR:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleDeletePost = async (postId) => {
  // Find the target post object from our array to inspect its author info
  const targetPost = posts.value.find(post => post._id === postId);
  
  if (!targetPost) return;

  // Extract author ID safely depending on whether your backend returns it as an object or a plain string
  const authorId = targetPost.author?._id || targetPost.author || targetPost.userId;

  // 1. Guard clause: Is the user logged in?
  if (!currentUser.value) {
    alert("You must be logged in to perform this action.");
    return;
  }

  // 2. Check permissions: Must be an admin OR the original author
  const isAdmin = currentUser.value.role === 'admin';
  const isAuthor = currentUser.value._id === authorId;

  if (!isAdmin && !isAuthor) {
    alert("Unauthorized. Only the author of this post or an administrator can delete it.");
    return;
  }

  // Proceed with deletion if they pass the check
  if (confirm("Are you sure you want to permanently delete this story?")) {
    try {
      await postService.deletePost(postId);
      posts.value = posts.value.filter(post => post._id !== postId);
      alert("Post successfully deleted!");
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      alert("Failed to delete post. Please verify your backend server connection.");
    }
  }
};


const deletePost = async () => {

}

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>

</style>