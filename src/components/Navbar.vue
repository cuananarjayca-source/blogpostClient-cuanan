<template>
    <nav class="navbar">
        <div class="nav-brand">
            <router-link to="/">The Daily Grind</router-link>
        </div>

        <div class="nav-links">
            <router-link to="/">Home</router-link>

            <!-- GUEST VIEW: If NOT logged in -->
            <template v-if="!currentUser">
                <router-link to="/login" class="btn-link">Login</router-link>
                <router-link to="/register" class="btn-link">Register</router-link>
            </template>

            <!-- AUTHENTICATED VIEW: If logged in -->
            <template v-else>
                <router-link to="/create" class="btn-highlight"> + New Post </router-link>
                
                <span class="user-badge">
                    <!-- If admin, show only "Admin" -->
                    <template v-if="currentUser.role === 'admin'">
                        Admin
                    </template>
                    <!-- Otherwise, show their authenticated name -->
                    <template v-else>
                        {{ currentUser.name }}
                    </template>
                </span>

                <button @click="handleLogout" class="btn-logout">Logout</button>
            </template>
        </div>
    </nav>
</template>


<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';

const router = useRouter();

const handleLogout = () => {
    authService.logout();
    router.push('/login');
}

const currentUser = computed(() => authService.currentUser.value);

</script>

<style scoped>

</style>