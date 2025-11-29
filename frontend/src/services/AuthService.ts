import { AppInfo, DataResponse, LoginRequest, User, UserData } from '@/types';
import Cookies from 'js-cookie';
import axiosClient from './axiosClient';

export class AuthService {
  public static async login({
    email,
    password,
  }: LoginRequest): Promise<DataResponse<UserData>> {
    const response = await axiosClient.post('/sign-in', {
      email,
      password,
    });
    return response.data;
  }

  public static async getUser(): Promise<DataResponse<User>> {
    const response = await axiosClient.get('/user');
    return response.data;
  }

  public static async refreshToken(
    refreshToken: string,
  ): Promise<DataResponse<UserData>> {
    const response = await axiosClient.post(
      '/refresh-token',
      {},
      {
        headers: {
          'x-refresh-token': refreshToken,
        },
      },
    );
    return response.data;
  }

  public static async logout(): Promise<void> {
    await axiosClient.post('/sign-out');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  public static async getInfo(): Promise<DataResponse<AppInfo>> {
    const response = await axiosClient.get('/app');
    return response.data;
  }

  public static async linkOAuthAccount({
    state,
    email,
    password,
  }: LoginRequest & { state: string }): Promise<DataResponse<void>> {
    const response = await axiosClient.post('/link-oauth-account', {
      state,
      email,
      password,
    });
    return response.data;
  }
}
