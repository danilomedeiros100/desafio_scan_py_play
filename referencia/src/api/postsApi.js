class PostsApi {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getPosts() {
    return this.apiClient.get('/posts');
  }

  async getPostById(id) {
    return this.apiClient.get(`/posts/${id}`);
  }

  async createPost(data) {
    return this.apiClient.post('/posts', data);
  }

  async getCommentsByPost(postId) {
    return this.apiClient.get(`/comments?postId=${postId}`);
  }
}

module.exports = { PostsApi };
