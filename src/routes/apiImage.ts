import express from "express";
import { addNewImage, checkImage } from "../controllers/apiImage";

const router = express.Router();

router.get("/image", checkImage, addNewImage);
export default router;
