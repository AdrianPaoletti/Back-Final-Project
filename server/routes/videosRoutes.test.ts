import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";
import supertest from "supertest";
import { initializeServer, app } from "../index";
import connectDB from "../../database";
import Video from "../../database/model/video";

const request = supertest(app);
let server;
let userToken;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_STRING_TEST);
  await Video.deleteMany({});
  server = await initializeServer(2000);
  await Video.create({
    url: "https://www.youtube.com/watch?v=2sML2bq_WGw&t=311s&ab_channel=NaryYnar",
    title: "BARCELONA",
    category: "music",
    date: "1995-12-17T02:24:00.000Z",
    description: "pepe",
    user: "61a3c4af9cf42368606872e7",
    _id: "61a3c4af9cf42368606872e8",
  });
  const postResponse = await request
    .post("/users/login")
    .send({ username: "juan", password: "juan" })
    .expect(200);
  userToken = postResponse.body.token;
});

afterAll((done) => {
  server.close(async () => {
    await Video.deleteMany({});
    await mongoose.connection.close();
    done();
  });
});

beforeEach(async () => {
  await Video.deleteMany({});
  await Video.create({
    url: "https://www.youtube.com/watch?v=2sML2bq_WGw&t=311s&ab_channel=NaryYnar",
    title: "BARCELONA",
    category: "music",
    date: "1995-12-17T02:24:00.000Z",
    description: "pepe",
    user: "61a3c4af9cf42368606872e7",
    _id: "61a3c4af9cf42368606872e8",
  });
});

describe("Given a /videos endpoint", () => {
  describe("When it receive a GET request", () => {
    test("Then it should respond with a videos array and a 200 status", async () => {
      const { body } = await request
        .get("/videos")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(body).toHaveLength(1);
      expect(body[0]).toHaveProperty("title", "BARCELONA");
    });
  });
});

describe("Given a /videos/category/:section endpoint", () => {
  describe("When it receive a GET request", () => {
    test("Then it should respond with a videos category array and a 200 status", async () => {
      const { body } = await request
        .get("/videos/category/music")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(body).toHaveLength(1);
      expect(body[0]).toHaveProperty("title", "BARCELONA");
    });
  });
  describe("When it receives and invalid categroy", () => {
    test("Then it should respond with an empty array", async () => {
      const { body } = await request
        .get("/videos/category/a")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(body).toHaveLength(0);
    });
  });
});

describe("Given a /videos/myvideos/create", () => {
  describe("When a POST request arrives with the right body", () => {
    test("Then it should respond with the new video", async () => {
      const newVideo = {
        url: "https://www.youtube.com/watch?v=2sML2bq_WGw&t=311s&ab_channel=NaryYnar",
        title: "MADRID",
        category: "music",
        date: "1995-12-17T02:24:00.000Z",
        description: "pepe",
        user: "61a3c4af9cf42368606872e7",
      };
      const { body } = await request
        .post("/videos/myvideos/create")
        .set("Authorization", `Bearer ${userToken}`)
        .send(newVideo)
        .expect(200);

      expect(body).toMatchObject(newVideo);
    });
  });
  describe("When a POST request arrives without a request", () => {
    test("Then it should respond with a 400 error", async () => {
      await request
        .post("/videos/myvideos/create")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(400);
    });
  });
});

describe("Given a /videos/detail/:idVideo endpoint", () => {
  describe("When it receive a GET request", () => {
    test("Then it should respond with the video of the id", async () => {
      const { body } = await request
        .get("/videos/detail/61a3c4af9cf42368606872e8")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(body).toHaveProperty("id", "61a3c4af9cf42368606872e8");
    });
  });
  describe("When it receive a GET request with an incorrect format id", () => {
    test("Then it should respond with a 400 error", async () => {
      await request
        .get("/videos/detail/a")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(400);
    });
  });
  describe("When it receive a GET request with an incorrect id", () => {
    test("Then it should respond with a 400 error", async () => {
      await request
        .get("/videos/detail/61a3c4af9cf42368606872e6")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });
  });
});

describe("Given a /videos/myvideos/created endpoint", () => {
  describe("When it receive a GET request", () => {
    test("Then it should respond with the videos the user created", async () => {
      await request
        .get("/videos/myvideos/created")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
    });
  });
});

describe("Given a /videos/myvideos/favourite endpoint", () => {
  describe("When it receive a GET request", () => {
    test("Then it should respond with the videos the user added to favourite", async () => {
      const { body } = await request
        .get("/videos/myvideos/favourite")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(body[0]).toHaveProperty("id", "61a3c4af9cf42368606872e8");
    });
  });
});

describe("Given a /myvideos/delete/:idVideo endpoint", () => {
  describe("When it receive a DELETE request", () => {
    test('Then it should respond with the text "Deleted successfully"', async () => {
      await Video.create({
        url: "https://www.youtube.com/watch?v=2sML2bq_WGw&t=311s&ab_channel=NaryYnar",
        title: "ZARAGOZA",
        category: "TOTO",
        date: "1995-12-17T02:24:00.000Z",
        description: "pepe",
        user: "61a3c4af9cf42368606872e7",
        _id: "61a3c4af9cf42368606872e9",
      });

      const { body } = await request
        .delete("/videos/myvideos/delete/61a3c4af9cf42368606872e9")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(body).toEqual("Deleted successfully");
    });
  });
  describe("When it receive a DELETE request with an incorrect format id", () => {
    test("Then it should respond with a 400 error", async () => {
      await Video.create({
        url: "https://www.youtube.com/watch?v=2sML2bq_WGw&t=311s&ab_channel=NaryYnar",
        title: "ZARAGOZA",
        category: "TOTO",
        date: "1995-12-17T02:24:00.000Z",
        description: "pepe",
        user: "61a3c4af9cf42368606872e7",
        _id: "61a3c4af9cf42368606872e9",
      });

      await request
        .delete("/videos/myvideos/delete/61a3c4af9cf4236860")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(400);
    });
  });
});

describe("Given a /myvideos/update/:idVideo endpoint", () => {
  describe("When it receive a PUT request", () => {
    test("Then it should respond with the video updated", async () => {
      const videoUpdated = {
        url: "https://www.youtube.com/watch?v=2sML2bq_WGw&t=311s&ab_channel=NaryYnar",
        title: "UPDATED",
        category: "music",
        date: "1995-12-17T02:24:00.000Z",
        description: "pepe",
        user: "61a3c4af9cf42368606872e7",
        _id: "61a3c4af9cf42368606872e8",
      };
      await request
        .put("/videos/myvideos/update/61a3c4af9cf42368606872e8")
        .set("Authorization", `Bearer ${userToken}`)
        .send(videoUpdated)
        .expect(200);
    });
  });
  describe("When it receive a PUT request with an incorrect id", () => {
    test("Then it should respond with a 400 error", async () => {
      const videoUpdated = {
        toto: "https://www.youtube.com/watch?v=2sML2bq_WGw&t=311s&ab_channel=NaryYnar",
        asdfas: "UPDATED",
        cateasdfagory: "music",
        datasdfe: "1995-12-17T02:24:00.000Z",
        desasdfcription: "pepe",
        uasdfser: "61a3c4af9cf42368606872e7",
        _iasdfd: "61a3c4af9cf42368606872e8",
      };
      await request
        .put("/videos/myvideos/update/61a3c4af9cf42368606872e2")
        .set("Authorization", `Bearer ${userToken}`)
        .send(videoUpdated)
        .expect(400);
    });
  });
});
