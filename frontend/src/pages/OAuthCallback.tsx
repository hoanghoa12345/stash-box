import { RefreshCw, Shield } from 'lucide-react';
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthCallback } from '@/hooks/useAuthCallback';
import LinkUserAccountDialog from '@/components/Dialog/LinkUserAccountDialog';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isProcessing, isSuccess, isError, error } = useAuthCallback();

  const isShowDialog = useMemo(() => {
    return isError && error?.errorCode === 'authorized_user_not_found';
  }, [isError, error]);

  const handleCloseDialog = (open: boolean) => {
    if(!open) {
      navigate('/login');
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Completing authentication...
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return <Navigate to="/" replace state={{ loggedIn: true }} />;
  }
  if (isError) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
          <div className="bg-white dark:bg-muted p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Authentication Error
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {error?.message}
              </p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Return to App
              </Button>
            </div>
          </div>
        </div>
        <LinkUserAccountDialog
          open={isShowDialog}
          onOpenChange={handleCloseDialog}
          initialData={error?.data}
        />
      </>
    );
  }

  return null;
};

export default OAuthCallback;
