export interface AuthPayload{
  id: number;
  email: string;
}

export interface PublicUser {
  id: number;
  email: string;
  name: string;
}

export interface ApiMessage {
  message: string;
}