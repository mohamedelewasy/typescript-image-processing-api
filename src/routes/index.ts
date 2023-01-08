import express from "express";
import { processImage } from "../utilities/sharp";
import { getThumbBuffer, getFullBuffer } from "../utilities/buffer";

const router = express.Router();
type Query = {
  fileName: string;
  width: string | number;
  height: string | number;
};

// @desc return image in response
const presentImage = async (req: express.Request, res: express.Response) => {
  const { fileName, width, height } = req.query as Query;
  const localImage = await getThumbBuffer(fileName, width, height);
  res.write(localImage);
  res.end();
};

// @desc a middleware to check if image is already processed > return image in response
//       else process a new image
const checkImage = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { fileName, width, height } = req.query as Query;
  if (!fileName) return res.status(400).send("fileName query is missing");
  if (!width) return res.status(400).send("width query is missing");
  if (!height) return res.status(400).send("height query is missing");
  const image = await getThumbBuffer(<string>fileName, width, height);
  if (!image) return next();
  await presentImage(req, res);
};

// @desc a middleware to process a new image then return image in response
const addNewImage = async (req: express.Request, res: express.Response) => {
  const { fileName, width, height } = req.query as Query;
  const image = await getFullBuffer(fileName);
  if (!image) return res.status(404).send("image not found");
  await processImage(image, <string>fileName, <number>+width, <number>+height);
  await presentImage(req, res);
};

router.get("/image", checkImage, addNewImage);
export default router;
