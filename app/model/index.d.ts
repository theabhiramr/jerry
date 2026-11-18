// this file is just for type checking. is not actually run...

export interface User {
  id: number;
  username: string;
  email: string | null;
  active: boolean;
  created_at: number;
}
