export interface jwtPayload {
  user: {
    id: string;
    email: string;
  };
}

export interface AccessToken {
  accessToken: string;
}
