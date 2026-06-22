import { ref } from 'vue';
import api from './api';

// 1. Initialize the reactive user state immediately when the app loads
const _currentUser = ref(null);

const initializeUser = () => {
    const user = localStorage.getItem('user');
    if (user && user !== "undefined") {
        try {
            _currentUser.value = JSON.parse(user);
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            _currentUser.value = null;
        }
    } else {
        _currentUser.value = null;
    }
};

// Run the initialization immediately
initializeUser();

export const authService = {

    async register(userData) {
        const response = await api.post('/users/register', userData);
        return response.data;
    },

    async login(credentials) {
        const response = await api.post('/users/login', credentials);
        const token = response.data.access;
        if (token) {
            localStorage.setItem('token', token);

            // Server login only returns the JWT — fetch user details separately
            try {
                const userResponse = await api.get('/users/details');
                const user = userResponse.data.user;
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    _currentUser.value = user;
                }
            } catch (detailsError) {
                console.error('Failed to fetch user details after login:', detailsError);
            }
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // 3. Reset the reactive state so components switch back to logged-out view
        _currentUser.value = null;
    },

    // 4. Expose the reactive ref so components can track changes
    currentUser: _currentUser,

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};
