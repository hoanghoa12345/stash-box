export interface IOAuthConfig {
  provider: string;
  client_id: string;
  redirect_uri: string;
  client_secret: string;
  token_endpoint: string;
  user_info_endpoint: string;
  authorization_endpoint: string;
  scope: string;
}

export interface IUserToken {
  access_token: string;
  refresh_token?: string;
  expires_at?: Date;
  scope?: string;
}

export interface IOAuthState {
  state_key: string;
  user_id?: string;
  timestamp: bigint;
  expires_at: Date;
}

export interface IOAuthIdentity {
  oauth_user_id: string;
  provider: string;
  auth_user_id?: string;
}

export interface IOAuthUser {
  id: string;
  email: string;
  name: string;
}

export interface JWTPayload {
  user: IOAuthUser;
  exp: number;
}
