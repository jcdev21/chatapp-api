export type JwtPayloadType = {
  refreshKey: Buffer;
  id: string;
  email: string;
  iat: number;
  exp: number;
};

export type PayloadJWTAccessTokenType = {
  refreshKey: Buffer;
  id: string;
  email: string;
};
