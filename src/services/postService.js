import api from './api';

export const postService = {
    // Matches: router.get('/getAllPosts', getAllPosts);
    async getAllPosts() {
        const response = await api.get('/posts/getAllPosts');
        return response.data;
    },

    // Matches: router.get('/getPostById/:id', getPostById);
    async getPostById(id) {
        const response = await api.get(`/posts/getPostById/${id}`);
        return response.data;
    },

    // Matches: router.post('/addPost', protect, addPost);
    async createPost(postData) {
        const response = await api.post('/posts/addPost', postData);
        return response.data;
    },

    // Matches: router.patch('/updatePost/:id', protect, updatePost);
    async updatePost(id, postData) {
        const response = await api.patch(`/posts/updatePost/${id}`, postData);
        return response.data;
    },

    // Matches: router.delete('/deletePost/:id', protect, deletePost);
    async deletePost(id) {
        const response = await api.delete(`/posts/deletePost/${id}`);
        return response.data;
    },

    // Matches: router.post('/addComment/:postId', protect, addComment);
    async addComment(postId, commentData) {
        const response = await api.post(`/comments/addComment/${postId}`, commentData);
        return response.data;
    },

    // Matches: router.get('/getComments/:postId', getComments);
    async getComments(postId) {
        const response = await api.get(`/comments/getComments/${postId}`);
        return response.data;
    }
};