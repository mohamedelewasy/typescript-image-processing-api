import express from "express";
import { addNewImage, checkImage } from "../controllers/apiImage";
import validator from "../validators/imageApi";

const router = express.Router();

router.get("/image", validator, checkImage, addNewImage);
export default router;
