import path from "path";
import sharp from "sharp";

// @desc return image width and height
export const getImageSize = async (buffer: Buffer) => {
  const metadata = await sharp(buffer).metadata();
  return { imgWidth: metadata.width, imgHeight: metadata.height };
};

// @desc process image with new width and height then save to thumb folder
export const processImage = async (
  buffer: Buffer,
  fileName: string,
  width: number,
  height: number
) => {
  const imgPath = path.join(
    __dirname,
    `../../assets/thumb/${fileName}_${width}_${height}.jpg`
  );
  await sharp(buffer).resize(width, height).toFile(imgPath);
};
