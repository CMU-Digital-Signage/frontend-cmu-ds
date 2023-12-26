export interface User {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isAdmin: boolean | null;
}
export interface Admin {
  id: string | null;
  firstName: string;
  lastName: string;
}
