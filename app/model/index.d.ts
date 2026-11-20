// this file is just for type checking. is not actually run...

export interface User {
  id: number;
  username: string;
  email?: string;
  active: boolean;
  created_at: Date;
}

export interface Site {
  id: number;
  slug: string;
  name: string;
  description: string;
  owner: User;
  created_at: Date;
}

export interface Page {
  id: number;
  site_id: number;
}
