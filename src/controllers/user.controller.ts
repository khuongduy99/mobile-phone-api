import { Handler } from "express";
import { nanoid } from "nanoid";
import { getConnection } from "../database";
import { User } from "../interfaces/user.interface";

export const findAll: Handler = (req, res) => {
  const data = getConnection().get("users").value();
  return res.json(data);
};

export const create: Handler = (req, res) => {
  const newUser = <User>req.body;
  newUser.id = nanoid();
  try {
    getConnection().get("users").push(newUser).write();
    res.json(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
};
