import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"
import { LogIn, RefreshCw, Shield } from "lucide-react"

const Login = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
      <div className="bg-white dark:bg-muted p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-primary">Welcome</h2>
          <p className="mt-2 text-muted-foreground">Sign in to access your account</p>

          <Button
            onClick={login}
            disabled={isLoading}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {isLoading ? 'Connecting...' : 'Sign in with OAuth'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login
