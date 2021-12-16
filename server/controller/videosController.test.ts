import { mockResponse, mockRequest } from "../utils/mocks/mockFunction";
import Video from "../../database/model/video";
import User from "../../database/model/user";
import { RequestAuth } from "../../interfaces/auth/auth";
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  addFavourite,
  getFavourite,
  getMyVideos,
  getVideosByCategory,
} from "./videosController";

jest.mock("../../database/model/video");

class ErrorCode extends Error {
  code: number | undefined;
}

const videos = [
  {
    url: "https://www.youtube.com/watch?v=2sML2bq_WGw&t=311s&ab_channel=NaryYnar",
    title: "BARCELONA",
    category: "music",
    date: "1995-12-17T02:24:00.000Z",
    description: "pepe",
    likes: 0,
    dislikes: 0,
    views: 0,
    user: null,
    comments: [
      {
        date: "1995-12-17T02:24:00.000Z",
        text: "bobobobobobobo",
        likes: 0,
        dislikes: 0,
        user: null,
        __v: 0,
        id: "61a1234cbc2b880a9525af0e",
      },
    ],
    __v: 9,
    id: "1",
  },
  {
    url: "https://www.youtube.com/watch?v=2sML2bq_WGw&t=311s&ab_channel=NaryYnar",
    title: "ZARAGOZA",
    category: "sport",
    date: "1995-12-17T02:24:00.000Z",
    description: "pepe",
    likes: 0,
    dislikes: 0,
    views: 0,
    user: null,
    comments: [
      {
        date: "1995-12-17T02:24:00.000Z",
        text: "bobobobobobobo",
        likes: 0,
        dislikes: 0,
        user: null,
        __v: 0,
        id: "61a1234cbc2b880a9525af0e",
      },
    ],
    __v: 9,
    id: "2",
  },
];

const user = {
  name: "raul",
  avatar: "asdf",
  username: "raul",
  password: "raul",
  myVideos: ["1", "2"],
  favouriteVideos: ["123"],
  save: jest.fn(),
};

describe("Given a getVideos function", () => {
  describe("When it receives a response and a next function", () => {
    test("Then it should response with the array of videos", async () => {
      const res = mockResponse();
      const next = jest.fn();
      Video.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(videos) });

      await getVideos(null, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(videos);
    });
  });

  describe("When there are not videos to find and it resolve to null", () => {
    test("Then it should call next function with an 404 error", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = jest.fn();
      Video.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
      const expectedError = new ErrorCode("Could not find videos");
      expectedError.code = 404;

      await getVideos(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the method find can not be executed", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = jest.fn();
      Video.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockRejectedValue({}) });
      const expectedError = new ErrorCode("General error on getting videos");
      expectedError.code = 400;

      await getVideos(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a getVideoById function", () => {
  describe("When it receives a request with the correct params id, a response and a next function", () => {
    test("Then it should return the searchedVideo in the res.json", async () => {
      Video.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(videos[0]),
        }),
      });
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      const res = mockResponse();
      const next = jest.fn();
      await getVideoById(req, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(videos[0]);
    });
  });

  describe("When the method findById find a video with a null value", () => {
    test("Then it should call next function with a 404 error code", async () => {
      Video.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        }),
      });
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      const res = mockResponse();
      const next = jest.fn();
      const expectedError = new ErrorCode("Could not find the id of the video");
      expectedError.code = 404;

      await getVideoById(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the idVideo of req.params is given with an incorrect format", () => {
    test("Then it should call next function with a 400 error code", async () => {
      Video.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue({}),
        }),
      });
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      const res = mockResponse();
      const next = jest.fn();
      const expectedError = new ErrorCode("Could not get id from params");
      expectedError.code = 400;

      await getVideoById(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a createVideo function", () => {
  describe("When the the function is called with a correct request body, a response and a next function", () => {
    test("Then it should call the method json with the newvideo", async () => {
      const req = mockRequest();
      req.body = { body: videos[0] };
      const res = mockResponse();
      Video.create = jest.fn().mockResolvedValue(videos[0]);
      User.findById = jest.fn().mockResolvedValue(user);

      await createVideo(req, res, null);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(videos[0]);
    });
  });

  describe("When the create method return a null value", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const req = mockRequest();
      req.body = { body: videos[0] };
      const next = jest.fn();
      Video.create = jest.fn().mockResolvedValue(null);
      const expectedError = new ErrorCode("Could not create video");
      expectedError.code = 404;

      await createVideo(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the request body is incorrect", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const req = mockRequest();
      req.body = { body: "asd" };
      const next = jest.fn();
      Video.create = jest.fn().mockRejectedValue({});
      const expectedError = new ErrorCode("Fail on create new video");
      expectedError.code = 400;

      await createVideo(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given an updateVideo function", () => {
  describe("When the the function is called with a correct request, a response and a next function", () => {
    test("Then it should call the json method with the updated video", async () => {
      Video.findByIdAndUpdate = jest.fn().mockResolvedValue(videos[0]);
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      const res = mockResponse();
      const next = jest.fn();

      await updateVideo(req, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(videos[0]);
    });
  });

  describe("When the findByIdAndUpdate method resolves to null", () => {
    test("Then it should call next function with a 404 error code", async () => {
      Video.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      const next = jest.fn();
      const expectedError = new ErrorCode(
        "Found the video but could not update"
      );
      expectedError.code = 404;

      await updateVideo(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the findByIdAndUpdate method rejects", () => {
    test("Then it should call next function with a 400 error code", async () => {
      Video.findByIdAndUpdate = jest.fn().mockRejectedValue({});
      const req = mockRequest() as RequestAuth;
      req.params = {
        id: "1",
      };
      const next = jest.fn();
      const expectedError = new ErrorCode(
        "General error on updating the video"
      );
      expectedError.code = 400;

      await updateVideo(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given an deleteVideo function", () => {
  describe("When the the function is called with a correct request, a response and a next function", () => {
    test("Then it should call the json method with the deleted video", async () => {
      const req = mockRequest() as RequestAuth;
      req.params = {
        id: "1",
      };
      Video.findByIdAndRemove = jest.fn().mockResolvedValue(videos[0]);
      User.findById = jest.fn().mockResolvedValue(user);
      const res = mockResponse();

      await deleteVideo(req, res, null);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith("Deleted successfully");
    });
  });

  describe("When the findByIdAndRemove method resolves to null", () => {
    test("Then it should call next function with a 404 error code", async () => {
      Video.findByIdAndRemove = jest.fn().mockResolvedValue(null);
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      const next = jest.fn();
      const expectedError = new ErrorCode(
        "Could not find id of video to remove"
      );
      expectedError.code = 404;

      await deleteVideo(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the findByIdAndRemove method rejects", () => {
    test("Then it should call next function with a 400 error code", async () => {
      Video.findByIdAndRemove = jest.fn().mockRejectedValue({});
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      const next = jest.fn();
      const expectedError = new ErrorCode("Could not get id from params");
      expectedError.code = 400;

      await deleteVideo(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a getMyVideos function", () => {
  describe("When it receives a correct request, a response and a next function", () => {
    test("Then it should call json method with the property myVideos in it", async () => {
      const req = mockRequest();
      const res = mockResponse();
      User.findById = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(user) });

      await getMyVideos(req, res, null);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user.myVideos);
    });
  });

  describe("When the request returns a null value", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const req = mockRequest();
      const next = jest.fn();
      User.findById = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
      const expectedError = new ErrorCode("Could not populate myVideos");
      expectedError.code = 404;

      await getMyVideos(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the request rejects", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const req = mockRequest();
      const next = jest.fn();
      User.findById = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockRejectedValue({}) });
      const expectedError = new ErrorCode("Could not get user to populate");
      expectedError.code = 400;

      await getMyVideos(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a getFavourite function", () => {
  describe("When it receives a correct request, a response and a next function", () => {
    test("Then it should call json method with the property myVideos in it", async () => {
      const req = mockRequest();
      const res = mockResponse();
      User.findById = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(user) });

      await getFavourite(req, res, null);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user.favouriteVideos);
    });
  });

  describe("When the request returns a null value", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const req = mockRequest();
      const next = jest.fn();
      User.findById = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
      const expectedError = new ErrorCode("Could not populate favouriteVideos");
      expectedError.code = 404;

      await getFavourite(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the request rejects", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const req = mockRequest();
      const next = jest.fn();
      User.findById = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockRejectedValue({}) });
      const expectedError = new ErrorCode("Could not get user to populate");
      expectedError.code = 400;

      await getFavourite(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given and addFavourite function", () => {
  describe("When it receives a request that resolves to null", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const next = jest.fn();
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      Video.findOne = jest.fn().mockResolvedValue(null);
      const expectedError = new ErrorCode(
        "Could no get id from params to add video"
      );
      expectedError.code = 400;

      await addFavourite(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When it receives a request a invalid id", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const next = jest.fn();
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      Video.findOne = jest.fn().mockRejectedValue({});
      const expectedError = new ErrorCode(
        "Could no get id from params to add video"
      );
      expectedError.code = 400;

      await addFavourite(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a getVideosByCategory function", () => {
  describe("When it receives a correct request params, a response and a next function", () => {
    test("Then it should call res method with the videos", async () => {
      const res = mockResponse();
      const req = mockRequest();
      req.params = {
        section: videos[0].category,
      };
      Video.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(videos[0]) });

      await getVideosByCategory(req, res, null);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(videos[0]);
    });
  });

  describe("When the method find resolves to null", () => {
    test("Then it should call next function with an 404 error", async () => {
      const next = jest.fn();
      const req = mockRequest();
      req.params = {
        section: videos[0].category,
      };
      Video.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
      const expectedError = new ErrorCode("Could not find category");
      expectedError.code = 404;

      await getVideosByCategory(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the method find can not be executed", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const next = jest.fn();
      const req = mockRequest();
      req.params = {
        section: videos[0].category,
      };
      Video.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockRejectedValue({}) });
      const expectedError = new ErrorCode("General error on getByCategory");
      expectedError.code = 400;

      await getVideosByCategory(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});
