import { useAuth } from '@/hooks/useAuth';
import { Navigate, NavigateFunction, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import logo from '@/assets/logo.svg';
import { useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/AuthService';
import axiosClient from '@/services/axiosClient';

const MainLayout = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['info'],
    queryFn: () => AuthService.getInfo(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  const setupInterceptors = (navigate: NavigateFunction) => {
    axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
        return Promise.reject(error);
      },
    );
  };

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="size-16 mb-4" />
        </div>
      </div>
    );
  }
  if (!user && !token) {
    return <Navigate to="/login" />;
  }
  return (
    <div data-layout="main" data-app-name={data?.data.app_name}>
      <Outlet />
    </div>
  );
};

export default MainLayout;
