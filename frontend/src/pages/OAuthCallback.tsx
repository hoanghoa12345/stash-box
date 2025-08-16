import axiosClient from '@/services/axiosClient';
import { RefreshCw, Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state');
        }

        const { data } = await axiosClient.get(
          `/callback?code=${code}&state=${state}`,
        );

        // Store token and user data
        Cookies.set('access_token', data.data.token, { expires: 7 });
        Cookies.set('user_data', JSON.stringify(data.data.user), { expires: 7 });

        // Redirect to main app
        window.location.href = import.meta.env.VITE_BASE_URL;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
      <div className="bg-white dark:bg-muted p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-red-600 dark:text-red-300" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Authentication Error
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          <Button
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Return to App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
