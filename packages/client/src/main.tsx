import './index.css';
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { Auth } from './routes/Auth';
import { AuthContextProvider } from './Store';
import AuthRoute from './components/AuthRoute';
import { Home } from './routes/Home';
import { Login } from './routes/Login';
import React from 'react';
import ReactDOM from 'react-dom/client';
const root = document.getElementById('root');
if (root === null) {
  throw new Error('Root element not found');
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRoute component={<Home />} />,
  },

  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
]);
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
