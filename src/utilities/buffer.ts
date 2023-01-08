import path from "path";
import { promises as fsPromises } from "fs";

// @desc return image buffer from assets folder or return undefined
export const getThumbBuffer = async (
  fileName: string,
  width: string | number,
  height: string | number
) => {
  try {
    const image = await fsPromises.readFile(
      path.join(
        __dirname,
        `../../assets/thumb/${fileName}_${width}_${height}.jpg`
      )
    );
    return image;
  } catch (err) {
    return undefined;
  }
};

export const getFullBuffer = async (fileName: string) => {
  try {
    const image = await fsPromises.readFile(
      path.join(__dirname, `../../assets/full/${fileName}.jpg`)
    );
    return image;
  } catch (err) {
    return undefined;
  }
};
