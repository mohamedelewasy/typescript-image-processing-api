import supertest from "supertest";
import { promises as fsPromises } from "fs";
import path from "path";
import server from "../../server";
import getBuffer from "../../utilities/buffer";
import { getImageSize } from "../../utilities/sharp";

const request = supertest(server);

describe("test process image", () => {
  describe("test image processing", () => {
    // recreate thumb folder
    beforeEach(async () => {
      await fsPromises.rmdir(path.join(__dirname, "../../../assets/thumb"), {
        recursive: true,
      });
      await fsPromises.mkdir(path.join(__dirname, "../../../assets/thumb"));
    });

    it("process a new image", async () => {
      await request.get("/api/image?fileName=temp&width=680&height=680");
      const buffer = await getBuffer("thumb", "temp", "680", "680");
      const size = await getImageSize(<Buffer>buffer);
      expect(size).toEqual({ imgWidth: 680, imgHeight: 680 });
    });
  });

  describe("test image already processed in thumb folder", () => {
    it("image with different width and height", async () => {
      const res = await request.get(
        "/api/image?fileName=temp&width=700&height=700"
      );
      expect(res.statusCode).toBe(200);
    });
  });

  describe("test states that throws errors", () => {
    it("missing fileName", async () => {
      const res = await request.get("/api/image?width=700&height=700");
      expect(res.statusCode).toBe(400);
    });
    it("missing width", async () => {
      const res = await request.get("/api/image?fileName=temp&height=700");
      expect(res.statusCode).toBe(400);
    });
    it("missing height", async () => {
      const res = await request.get("/api/image?fileName=temp&width=700");
      expect(res.statusCode).toBe(400);
    });
  });
});
