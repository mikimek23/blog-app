import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './src/App.jsx'
import { Home } from './src/components/Home.jsx'
import { Login } from './src/pages/Login.jsx'
import { Signup } from './src/pages/Signup.jsx'
import { AuthLayout } from './src/layout/AuthLayout.jsx'
import { Bloglist } from './src/pages/Bloglist.jsx'
import { Post } from './src/pages/Post.jsx'
import { Adminlogin } from './src/components/admin/Adminlogin.jsx'
import { AdminDashboard } from './src/layout/AdminDashboard.jsx'
import { PostStatus } from './src/components/admin/PostStatus.jsx'
import { PostForm } from './src/components/admin/PostForm.jsx'
import { ManagePost } from './src/components/admin/ManagePost.jsx'
import { AdminRoute } from './src/components/routes/AdminRoute.jsx'
import { SessionLayout } from './src/layout/SessionLayout.jsx'
import { Profile } from './src/pages/Profile.jsx'
import { UserProfile } from './src/pages/UserProfile.jsx'
import { UserManagement } from './src/components/admin/UserManagement.jsx'
import { ModerationQueue } from './src/components/admin/ModerationQueue.jsx'
import { ProtectedRoute } from './src/components/routes/ProtectedRoute.jsx'

export const router = createBrowserRouter([
  {
    element: <SessionLayout />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'posts',
            element: <Bloglist />,
          },
          {
            path: 'posts/:id',
            element: <Post />,
          },
          {
            path: 'users/:username',
            element: <UserProfile />,
          },
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: 'profile',
                element: <Profile />,
              },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/signup',
            element: <Signup />,
          },
        ],
      },
      {
        path: '/admin/login',
        element: <Adminlogin />,
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: '/admin',
            element: <AdminDashboard />,
            children: [
              {
                index: true,
                element: <Navigate to='dashboard' replace />,
              },
              {
                path: 'dashboard',
                element: <PostStatus />,
              },
              {
                path: 'posts',
                element: <ManagePost />,
              },
              {
                path: 'posts/create',
                element: <PostForm />,
              },
              {
                path: 'posts/:id/edit',
                element: <PostForm />,
              },
              {
                path: 'users',
                element: <UserManagement />,
              },
              {
                path: 'moderation',
                element: <ModerationQueue />,
              },
            ],
          },
        ],
      },
    ],
  },
])
