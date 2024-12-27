export type UserType = {
  username: string;
  token: string;
};

export type JwtPayloadType = {
  username: string;
  password: string;
  iat?: number;
  exp?: number;
};

export type LoginPayloadType = JwtPayloadType;
export type SignUpPayloadType = JwtPayloadType;
