import supertest from "supertest";
import { promises as fsPromises } from "fs";
import path from "path";
import server from "../../server";
import getBuffer from "../../utilities/buffer";
import { getImageSize } from "../../utilities/sharp";

const request = supertest(server);

describe("test process image on image for the first time", () => {
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

  describe("test image already processed in thumb folder for the second time", () => {
    it("image with the same width and height", async () => {
      const res = await request.get(
        "/api/image?fileName=temp&width=680&height=680"
      );
      expect(res.statusCode).toBe(200);
      const buffer = await getBuffer("thumb", "temp", "680", "680");
      const size = await getImageSize(<Buffer>buffer);
      expect(size).toEqual({ imgWidth: 680, imgHeight: 680 });
      // compare createdAt with modifiedAt for the file
      const image = await fsPromises.stat(
        path.join(__dirname, "../../../assets/thumb/temp_680_680.jpg")
      );
      expect(image.mtime.getTime()).toBe(image.ctime.getTime());
    });
  });

  describe("test states that throws errors", () => {
    it("missing fileName", async () => {
      const res = await request.get("/api/image?width=700&height=700");
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.length).toBe(4);
      expect(res.body.errors[0]).toEqual(
        jasmine.objectContaining({
          msg: "fileName query parameter is required",
        })
      );
      expect(res.body.errors[1]).toEqual(
        jasmine.objectContaining({ msg: "fileName must be string" })
      );
      expect(res.body.errors[2]).toEqual(
        jasmine.objectContaining({
          msg: "fileName must be at least 1 character and at maximum 32 character",
        })
      );
      expect(res.body.errors[3]).toEqual(
        jasmine.objectContaining({ msg: "image not found" })
      );
    });
    it("too long fileName", async () => {
      const res = await request.get(
        "/api/image?fileName=lkhjghjgjhghjgkjhjhgfcgjhgjkkjhh2&width=700&height=700"
      );
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.length).toBe(2);
      expect(res.body.errors[0]).toEqual(
        jasmine.objectContaining({
          msg: "fileName must be at least 1 character and at maximum 32 character",
        })
      );
      expect(res.body.errors[1]).toEqual(
        jasmine.objectContaining({
          msg: "image lkhjghjgjhghjgkjhjhgfcgjhgjkkjhh2.jpg not found",
        })
      );
    });
    it("fileName with not found image", async () => {
      const res = await request.get(
        "/api/image?fileName=asmr&width=700&height=700"
      );
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors[0]).toEqual(
        jasmine.objectContaining({
          msg: "image asmr.jpg not found",
        })
      );
    });
    it("missing width", async () => {
      const res = await request.get("/api/image?fileName=temp&height=700");
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.length).toBe(3);
      expect(res.body.errors[0]).toEqual(
        jasmine.objectContaining({
          msg: "width query parameter is required",
        })
      );
      expect(res.body.errors[1]).toEqual(
        jasmine.objectContaining({
          msg: "width must be a number",
        })
      );
      expect(res.body.errors[2]).toEqual(
        jasmine.objectContaining({
          msg: "width must be in range 10-2000px",
        })
      );
    });
    it("width is not a number", async () => {
      const res = await request.get(
        "/api/image?fileName=temp&width=abc&height=700"
      );
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.length).toBe(2);
      expect(res.body.errors[0]).toEqual(
        jasmine.objectContaining({
          msg: "width must be a number",
        })
      );
      expect(res.body.errors[1]).toEqual(
        jasmine.objectContaining({
          msg: "width must be in range 10-2000px",
        })
      );
    });
    it("width is invalid range", async () => {
      const res = await request.get(
        "/api/image?fileName=temp&width=2500&height=700"
      );
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors[0]).toEqual(
        jasmine.objectContaining({
          msg: "width must be in range 10-2000px",
        })
      );
    });
    it("missing height", async () => {
      const res = await request.get("/api/image?fileName=temp&width=700");
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.length).toBe(3);
      expect(res.body.errors[0]).toEqual(
        jasmine.objectContaining({
          msg: "height query parameter is required",
        })
      );
      expect(res.body.errors[1]).toEqual(
        jasmine.objectContaining({
          msg: "height must be a number",
        })
      );
      expect(res.body.errors[2]).toEqual(
        jasmine.objectContaining({
          msg: "height must be in range 10-2000px",
        })
      );
    });
    it("height is not a number", async () => {
      const res = await request.get(
        "/api/image?fileName=temp&width=700&height=abc"
      );
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.length).toBe(2);
      expect(res.body.errors[0]).toEqual(
        jasmine.objectContaining({
          msg: "height must be a number",
        })
      );
      expect(res.body.errors[1]).toEqual(
        jasmine.objectContaining({
          msg: "height must be in range 10-2000px",
        })
      );
    });
    it("height is invalid range", async () => {
      const res = await request.get(
        "/api/image?fileName=temp&width=700&height=2500"
      );
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors[0]).toEqual(
        jasmine.objectContaining({
          msg: "height must be in range 10-2000px",
        })
      );
    });
  });
});
