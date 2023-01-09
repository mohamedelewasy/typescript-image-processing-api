import { processImage, getImageSize } from "../../utilities/sharp";
import getBuffer from "../../utilities/buffer";

describe("test process image if it generate image correctly", () => {
  it("test image with 600X600px", async () => {
    const buffer = await getBuffer("full", "stopWishing");
    await processImage(<Buffer>(<unknown>buffer), "stopWishing", 600, 600);
    const generatedBuffer = await getBuffer(
      "thumb",
      "stopWishing",
      "600",
      "600"
    );
    const size = await getImageSize(<Buffer>(<unknown>generatedBuffer));
    expect(size).toEqual({ imgHeight: 600, imgWidth: 600 });
  });

  it("test image with 1200X1200px", async () => {
    const buffer = await getBuffer("full", "stopWishing");
    await processImage(<Buffer>(<unknown>buffer), "stopWishing", 1200, 1200);
    const generatedBuffer = await getBuffer(
      "thumb",
      "stopWishing",
      "1200",
      "1200"
    );
    const size = await getImageSize(<Buffer>(<unknown>generatedBuffer));
    expect(size).toEqual({ imgHeight: 1200, imgWidth: 1200 });
  });
});
