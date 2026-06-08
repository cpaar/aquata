export type AuthenticatedUser = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export type AuthenticatedRequest = {
  user?: AuthenticatedUser;
  cookies?: Record<string, string | undefined>;
  header(name: string): string | undefined;
};
