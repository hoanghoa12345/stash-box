import axiosClient from '@/services/axiosClient';
import { useEffect, useReducer } from 'react';
import { useAuth } from './useAuth';
import { AxiosError } from 'axios';

enum AuthCallbackActionType {
  AUTH_CALLBACK_REQUEST = 'AUTH_CALLBACK_REQUEST',
  AUTH_CALLBACK_SUCCESS = 'AUTH_CALLBACK_SUCCESS',
  AUTH_CALLBACK_ERROR = 'AUTH_CALLBACK_ERROR',
}

interface AuthCallbackError {
  message: string;
  errorCode?: string;
}

interface AuthCallbackAction {
  type: AuthCallbackActionType;
  payload?: AuthCallbackError;
}

interface AuthCallbackState {
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: AuthCallbackError;
}

export const authCallbackReducer = (
  state: AuthCallbackState,
  action: AuthCallbackAction,
): AuthCallbackState => {
  switch (action.type) {
    case AuthCallbackActionType.AUTH_CALLBACK_REQUEST:
      return {
        ...state,
        isProcessing: true,
      };
    case AuthCallbackActionType.AUTH_CALLBACK_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        isSuccess: true,
        isError: false,
        error: undefined,
      };
    case AuthCallbackActionType.AUTH_CALLBACK_ERROR:
      return {
        ...state,
        isProcessing: false,
        isSuccess: false,
        isError: true,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useAuthCallback = () => {
  const { setUserToken } = useAuth();
  const [state, dispatch] = useReducer(authCallbackReducer, {
    isProcessing: false,
    isSuccess: false,
    isError: false,
    error: undefined,
  });

  useEffect(() => {
    const handleCallback = async () => {
      try {
        dispatch({ type: AuthCallbackActionType.AUTH_CALLBACK_REQUEST });
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

        const callbackUrl = `/callback?code=${code}&state=${state}`;
        const { data } = await axiosClient.get(callbackUrl);

        // Store token and user data
        setUserToken(data.data.user, data.data.token);

        dispatch({ type: AuthCallbackActionType.AUTH_CALLBACK_SUCCESS });
      } catch (err) {
        let message = (err as Error).message;
        let errorCode = '';
        if (err instanceof AxiosError) {
          message = err.response?.data.msg;
          errorCode = err.response?.data.data?.error_code;
        }
        dispatch({
          type: AuthCallbackActionType.AUTH_CALLBACK_ERROR,
          payload: {
            message,
            errorCode,
          },
        });
      }
    };

    handleCallback();
  }, []);

  return state;
};
