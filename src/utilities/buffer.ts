import path from "path";
import { promises as fsPromises } from "fs";

type st_num = string | number;

const getImagePath = (
  folderName: string,
  fileName: string,
  width?: string | number,
  height?: string | number
) => {
  if (folderName === "thumb")
    return path.join(
      __dirname,
      `../../assets/thumb/${fileName}_${width}_${height}.jpg`
    );
  else return path.join(__dirname, `../../assets/full/${fileName}.jpg`);
};

// @desc return image in buffer datatype from assets folder or return undefined
const getImageBuffer = async (
  folderName: string,
  fileName: string,
  width?: st_num,
  height?: st_num
) => {
  try {
    const image = await fsPromises.readFile(
      getImagePath(folderName, fileName, width, height)
    );
    return image;
  } catch (err) {
    return undefined;
  }
};

export default getImageBuffer;
