import { Request as Req, Response as Res, NextFunction as Next } from "express";
import asyncHandler from "express-async-handler";
import { processImage } from "../utilities/sharp";
import getBuffer from "../utilities/buffer";

type Query = {
  fileName: string;
  width: string;
  height: string;
};

// @desc return image in response
const presentImage = async (req: Req, res: Res) => {
  const { fileName, width, height } = req.query as Query;
  const localImage = await getBuffer("thumb", fileName, width, height);
  res.write(localImage);
  res.end();
};

// @desc a middleware to check if image is already processed > return image in response
//       else process a new image
export const checkImage = asyncHandler(
  async (req: Req, res: Res, next: Next) => {
    const { fileName, width, height } = req.query as Query;
    const image = await getBuffer("thumb", fileName, width, height);
    if (!image) return next();
    await presentImage(req, res);
  }
);

// @desc a middleware to process a new image then return image in response
export const addNewImage = asyncHandler(async (req: Req, res: Res) => {
  const { fileName, width, height } = req.query as Query;
  const image = await getBuffer("full", fileName);
  await processImage(<Buffer>image, fileName, +width, +height);
  await presentImage(req, res);
});
