export interface AuthResponse {
  kind: string;
  localId: string;
  email: string;
  idToken: string;
  expiresIn: string;
  refreshToken: string;
  registered?: boolean;
}