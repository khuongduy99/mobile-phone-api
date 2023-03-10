import { getConnection } from "../database";
import { Request, Response } from "express";
import { Product } from "../interfaces/product.interface";
import { nanoid } from "nanoid";

class ProductController {
  static getItems = (req: Request, res: Response) => {
    let result: Product[] = [];
    const brandIds = req.query.brandIds as string[];
    const priceFrom = Number(req.query.priceFrom);
    const priceTo = Number(req.query.priceTo);
    const sortBy = req.query.sortBy as string;
    const data = getConnection()
      .get("products")
      .sortBy(sortBy)
      .value()
      .reverse();

    data.map((item) => {
      let value = null;

      if (brandIds && brandIds.length != 0 && brandIds.includes(item.brandId))
        value = item;
      if (!brandIds) value = item;
      if (value) {
        let isMatchValue = true;
        if (priceFrom && priceTo) {
          if (!(value.price >= priceFrom && value.price <= priceTo))
            isMatchValue = false;
        } else if (priceFrom) {
          if (!(value.price >= priceFrom)) isMatchValue = false;
        } else if (priceTo) {
          if (!(value.price <= priceTo)) isMatchValue = false;
        }
        if (isMatchValue) result.push(value);
      }
    });
    return res.status(200).json(result);
  };
  static getItemById = (req: Request, res: Response) => {
    const { id } = req.params;
    let data = null;
    if (id) {
      data = getConnection()
        .get("products")
        .find({ id: req.params.id })
        .value();
    }
    return res.status(200).json(data);
  };
  static getItemByCondition = (req: Request, res: Response) => {
    let data = null;
    // if (brandIds) {
    //   data = getConnection()
    //     .get("products")
    //     .find({ id: req.params.id })
    //     .value();
    // }
    console.log(req.query.color1);
    return res.status(200).json(data);
  };
  static create = (req: Request, res: Response) => {
    const newProduct = <Product>req.body;
    const { name, brandId, price, image, percentDiscount } = newProduct;

    if (!name) {
      return res.status(409).json({ message: "T??n s???n ph???m l?? b???t bu???c" });
    } else {
      if (name.length < 2 || name.length > 300) {
        return res
          .status(409)
          .json({ message: "T??n s???n ph???m ph???i t??? 2 -> 300 k?? t???" });
      }
    }

    if (!name) {
      return res.status(409).json({ message: "T??n s???n ph???m l?? b???t bu???c" });
    } else {
      if (name.length < 2 || name.length > 300) {
        return res
          .status(409)
          .json({ message: "T??n s???n ph???m ph???i t??? 2 -> 300 k?? t???" });
      }
    }

    if (!brandId) {
      return res.status(409).json({ message: "Id nh??n h??ng l?? b???t bu???c" });
    } else {
      const brand = getConnection().get("brands").find({ id: brandId }).value();

      if (!brand) {
        return res.status(409).json({ message: "Nh??n h??ng kh??ng t???n t???i" });
      }
    }

    if (!price) {
      return res.status(409).json({ message: "Gi?? s???n ph???m l?? b???t bu???c" });
    }

    if (!image) {
      return res.status(409).json({ message: "H??nh ???nh l?? b???t bu???c" });
    }

    newProduct.id = nanoid();
    newProduct.createAt = String(new Date().getTime());

    try {
      getConnection().get("products").push(newProduct).write();
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(500).send(error);
    }
  };
}
export default ProductController;
