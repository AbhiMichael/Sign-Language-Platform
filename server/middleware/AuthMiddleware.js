import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

let WT_SECRET = process.env.WT_SECRET;

export default function AuthMiddleWare(req, res, next) {
  let token = req.headers.token;

  jwt.verify(token, WT_SECRET, (err, suc) => {
    if (err)
      res
        .status(400)
        .json({ err: "Invalid Credintials please try logging in again" });
    else {
      req.body.token = suc;
      console.log("auth", suc);
      next();
    }
  });
}
