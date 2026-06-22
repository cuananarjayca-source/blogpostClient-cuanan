# BlogPostAPI

## 🚀 Purpose & Features

This API handles data persistence, resource relationships, and security controls for the frontend application. It contains no unnecessary bloat, sticking strictly to core functional requirements.

### Key API Functionalities
1. **User Authentication & Security**
   - User registration with unique accounts (`email`, `username`, `password`).
   - Secure user login generating temporary access tokens.
   - Server-side password hashing using industry-standard hashing protocols before database storage.
   - Custom authentication middleware to protect state-changing routes.

2. **Blog Post Management (CRUD)**
   - **Create**: Authenticated users can write and publish new blog posts.
   - **Read**: Publicly view all available blog posts or fetch details of a single post by its ID.
   - **Update**: Securely modify an existing blog post (restricted exclusively to the original author).

   
## Credentials

1. **User**
  - **Username**: johndoe@mail.com
  - **Password**: john12345

2. **Admin**
  - **Username**: admin@mail.com
  - **Password**: admin12345