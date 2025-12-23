# Social Platform - Next.js + TypeScript + PostgreSQL

A full-featured social media platform built with Next.js 15, TypeScript, PostgreSQL, and Prisma.

## 🚀 Features Implemented

### ✅ Backend Complete
- **User Authentication**
  - User registration with bcrypt password hashing
  - Login/logout with NextAuth.js
  - JWT-based session management

- **Posts**
  - Create posts with text content
  - Upload images with posts
  - View all posts (feed)
  - Delete own posts

- **Comments**
  - Add comments to posts
  - View comments on posts

- **Likes**
  - Like/unlike posts
  - View like counts

- **Database Schema**
  - Users, Posts, Comments, Likes
  - Follow system (followers/following)
  - Conversations and Messages (for chat feature)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+
- PostgreSQL database
- npm or yarn

## 🛠️ Setup Instructions

### 1. Install Dependencies

Dependencies are already installed, but if needed:
```bash
npm install
```

### 2. Configure Environment Variables

Update the `.env` file with your PostgreSQL connection string:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth - Generate a secure secret
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# UploadThing (Optional - for file uploads)
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```

**To generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Set Up PostgreSQL Database

Make sure you have a PostgreSQL database running. You can:
- Use a local PostgreSQL installation
- Use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`
- Use a cloud service (Supabase, Neon, Railway, etc.)

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Generate the Prisma Client

### 5. (Optional) Seed the Database

You can create a seed file to add test data if needed.

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
social-platform/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth API routes
│   │   ├── register/               # User registration
│   │   └── posts/                  # Post CRUD operations
│   │       ├── route.ts            # GET all posts, CREATE post
│   │       └── [postId]/
│   │           ├── route.ts        # DELETE post
│   │           ├── comments/       # POST comment
│   │           └── like/           # POST toggle like
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── auth.ts                     # NextAuth configuration
│   └── utils.ts                    # Utility functions
├── prisma/
│   └── schema.prisma               # Database schema
├── types/
│   └── next-auth.d.ts              # NextAuth type extensions
└── .env                            # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post (requires auth)
- `DELETE /api/posts/[postId]` - Delete a post (requires auth)

### Comments
- `POST /api/posts/[postId]/comments` - Add comment to post (requires auth)

### Likes
- `POST /api/posts/[postId]/like` - Toggle like on post (requires auth)

## 🎨 Next Steps - Frontend Development

The backend is complete! Here's what you can build next:

### 1. Authentication Pages
- Create `/app/login/page.tsx` - Login form
- Create `/app/register/page.tsx` - Registration form

### 2. Main Feed
- Create `/app/page.tsx` - Home feed with posts
- Build `PostCard` component to display posts
- Add `CreatePost` component for new posts

### 3. User Profile
- Create `/app/profile/[userId]/page.tsx`
- Show user's posts, followers, following

### 4. Real-time Chat
- Implement Socket.io for real-time messaging
- Create chat UI components
- Use the Conversation and Message models

### 5. File Uploads
- Set up UploadThing for image uploads
- Add image upload to posts
- Add profile picture uploads

### 6. Additional Features
- Search functionality
- Notifications
- Follow/unfollow users
- Edit posts
- Post pagination
- Dark mode

## 🧪 Testing the API

You can test the API endpoints using tools like:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example: Register a user
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## 📚 Technologies Used

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Password Hashing:** bcryptjs

## 🔒 Security Notes

- Passwords are hashed using bcrypt
- JWT tokens for session management
- API routes protected with authentication middleware
- Environment variables for sensitive data

## 📝 Database Schema

The database includes:
- **User**: Authentication and profile data
- **Post**: User posts with content and images
- **Comment**: Comments on posts
- **Like**: Post likes
- **Follow**: User follow relationships
- **Conversation**: Chat conversations
- **ConversationParticipant**: Users in conversations
- **Message**: Chat messages

## 🤝 Contributing

This is a starter template. Feel free to:
- Add new features
- Improve existing code
- Add tests
- Enhance UI/UX

## 📄 License

MIT License - feel free to use this project for learning or production!

---

**Happy Coding! 🎉**

For questions or issues, refer to the documentation of the technologies used.
