import { getConnection } from "../database";
import { Request, Response } from "express";
import { Brand } from "../interfaces/brand.interface";
import { nanoid } from "nanoid";

class BrandController {
  static create = (req: Request, res: Response) => {
    const newBrand = <Brand>req.body;
    const { name } = newBrand;

    if (!name) {
      return res.status(409).json({ message: "Tên thương hiệu là bắt buộc" });
    } else {
      if (name.length < 2 || name.length > 100) {
        return res
          .status(409)
          .json({ message: "Tên tài khoản phải từ 2 -> 100 ký tự" });
      }
    }
    newBrand.id = nanoid();
    newBrand.createAt = String(new Date().getTime());
    try {
      getConnection().get("brands").push(newBrand).write();
      return res.json(newBrand);
    } catch (error) {
      return res.status(500).send(error);
    }
  };

  static findAll = (req: Request, res: Response) => {
    const data = getConnection().get("brands").value();
    return res.json(data);
  };

  static findById = (req: Request, res: Response, id: string) => {
    const data = getConnection().get("brands").find({ id: id }).value();
    return res.json(data);
  };
}
export default BrandController;
