<template>
    <div class="auth-container">
        <h2>Create an Account</h2>

        <form @submit.prevent="handleRegister" class="auth-form">
            <div v-if="errorMessage" class="error-banner">
                {{ errorMessage }}
            </div>

            <div class="form-group">
                <label for="name"> Full Name</label>
                <input
                    id="name"
                    v-model.trim="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                />
            </div>

            <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                    id="email"
                    type="email"
                    v-model.trim="email"
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input 
                    id="password"
                    type="password"
                    v-model="password"
                    placeholder="Enter your password"
                    required
                />
            </div>

            <button type="submit" :disabled="isLoading" class="btn-submit">
                {{ isLoading ? 'Creating Account...' : 'Register' }}
            </button>
        </form>
        <p class="switch-link">
            Already have an account?
            <router-link to="/login">Login here</router-link>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {authService } from '../services/authService';

const router = useRouter();

// Reactive form fields
const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
    if(!name.value || !email.value || !password.value) {
        errorMessage.value = 'All fields are requred.';
    }

    try {
        isLoading.value = true;
        errorMessage.value = '';

        // Payload sent to backend
        await authService.register({
            name: name.value,
            email: email.value,
            password: password.value,
        });

        router.push('/login');
    } catch(error) {
        errorMessage.value = error.response?.data?.message || 'Registration failed. Try again';
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
  
</style>