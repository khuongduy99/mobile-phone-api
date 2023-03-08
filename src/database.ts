import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { User } from "./interfaces/user.interface";

type Schema = {
  users: User[];
};

let db: lowdb.LowdbSync<Schema>;

export const createConnection = async () => {
  const adapter = new FileSync<Schema>("data.json");
  db = lowdb(adapter);
  db.defaults({ users: [] }).write();
};

export const getConnection = () => db;
