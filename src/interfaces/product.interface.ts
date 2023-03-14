import { Base } from "./base.interface";

export interface Product extends Base {
  name: string;
  brandId: string;
  price: number;
  percentDiscount?: number;
  qtySold: number;
  image: string;
}
