import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Brand } from "./interfaces/brand.interface";
import { Product } from "./interfaces/product.interface";
import { User } from "./interfaces/user.interface";

type Schema = {
  users: User[];
  products: Product[];
  brands: Brand[];
};

let db: lowdb.LowdbSync<Schema>;

export const createConnection = async () => {
  const adapter = new FileSync<Schema>("data.json");
  db = lowdb(adapter);
  db.defaults({ users: [], products: [], brands: [] }).write();
};

export const getConnection = () => db;
