import { createBrowserRouter } from 'react-router-dom'
import { Home } from './src/components/Home.jsx'
import { Login } from './src/pages/login.jsx'
import { Signup } from './src/pages/Signup.jsx'
import App from './src/App.jsx'
import { AuthLayout } from './src/layout/AuthLayout.jsx'
import { Bloglist } from './src/pages/Bloglist.jsx'
import { Post } from './src/pages/Post.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/posts',
        element: <Bloglist />,
      },
      {
        path: '/posts/:id',
        element: <Post />,
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
])
