import { Base } from "./base.interface";

export interface User extends Base {
  username: string;
  password: string;
  refreshToken: string;
  roles: string[];
}
