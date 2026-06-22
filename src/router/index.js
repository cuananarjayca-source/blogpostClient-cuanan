import { createRouter, createWebHistory } from "vue-router";
import { authService } from '../services/authService';

// Import Views
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import PostDetailView from '../views/PostDetailView.vue';
import CreatePostView from '../views/CreatePostView.vue';
import EditPostView from '../views/EditPostView.vue';

const routes = [
    // Public Routes
    { path: '/', name: 'home', component: HomeView },
    { path: '/posts/:id', name: 'post-detail', component: PostDetailView },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },

    // Protected Routes (Requires Authentication)
    {
        path: '/create',
        name: 'create-post',
        component: CreatePostView,
        meta: { requiresAuth: true }
    },
    {
        path: '/posts/edit/:id',
        name: 'edit-post',
        component: EditPostView,
        meta: { requiresAuth: true }
    },

    // Catch-all Redirect for invalid URLs
    { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
    const loggedIn = authService.isAuthenticated();

    // Route requires auth, but user is not logged in -> redirect to login
    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
        return next({ name: 'login' });
    }

    // Logged-In user tries to access Login/Register pages -> redirect to Home
    if (to.matched.some(record => record.meta.guestOnly) && loggedIn) {
        return next({ name: 'home' });
    }

    // Otherwise proceed normally
    next();
});

export default router;