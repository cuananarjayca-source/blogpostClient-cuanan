<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';

const router = useRouter();

// Input references
const email = ref('');
const password = ref('');

// Operational state trackers
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  // Defensive validation gate
  if (!email.value || !password.value) {
    errorMessage.value = 'Please provide both email and password.';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';

    // Hits your backend router path: router.post('/login', login);
    // This will securely capture the JWT token and mutate authService.currentUser reactively
    await authService.login({
      email: email.value,
      password: password.value,
    });

    console.log('✅ Authentication successful! Navigating to home feed...');
    
    // Redirect to the blog post dashboard
    router.push('/');
  } catch (error) {
    console.error('❌ Login attempt rejected:', error);
    errorMessage.value = error.response?.data?.message || 'Invalid email or password.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-wrapper">
    <h2>Login</h2>
    
    <form @submit.prevent="handleLogin">
      <div v-if="errorMessage" class="error-text form-error">
        {{ errorMessage }}
      </div>

      <div class="form-field">
        <label for="email">Email:</label>
        <input 
          id="email"
          v-model.trim="email" 
          type="email" 
          placeholder="Enter email address"
          required 
          :disabled="isLoading"
        />
      </div>

      <div class="form-field">
        <label for="password">Password:</label>
        <input 
          id="password"
          v-model="password" 
          type="password" 
          placeholder="Enter password"
          required 
          :disabled="isLoading"
        />
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Verifying...' : 'Submit Login' }}
        </button>
      </div>
    </form>

    <p class="switch-link">
      Don't have an account? <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<style scoped></style>