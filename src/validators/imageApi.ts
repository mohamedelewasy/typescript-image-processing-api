import { query } from "express-validator";
import handlerMiddleware from "../middlewares/validatorHandler";
import getImageBuffer from "../utilities/buffer";

const validate = [
  query("fileName")
    .exists()
    .withMessage("fileName query parameter is required")
    .isString()
    .withMessage("fileName must be string")
    .isLength({ min: 1, max: 32 })
    .withMessage(
      "fileName must be at least 1 character and at maximum 32 character"
    )
    .custom(async (val) => {
      const image = await getImageBuffer("full", val);
      if (image === undefined)
        return Promise.reject(
          new Error(`image ${val ? val + ".jpg " : ""}not found`)
        );
    }),
  query("width")
    .exists()
    .withMessage("width query parameter is required")
    .isNumeric()
    .withMessage("width must be a number")
    .isInt({ min: 10, max: 2000 })
    .withMessage("width must be in range 10-2000px"),
  query("height")
    .exists()
    .withMessage("height query parameter is required")
    .isNumeric()
    .withMessage("height must be a number")
    .isInt({ min: 10, max: 2000 })
    .withMessage("height must be in range 10-2000px"),
  handlerMiddleware,
];

export default validate;
