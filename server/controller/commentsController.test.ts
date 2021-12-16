import { mockResponse, mockRequest } from "../utils/mocks/mockFunction";
import Comment from "../../database/model/comment";
import { createComment, deleteComment, getComment, updateComment } from "./commentsController";
import Video from "../../database/model/video";

jest.mock("../../database/model/comment");
jest.mock("../../database/model/video");

class ErrorCode extends Error {
  code: number | undefined;
}

const comment = {
  date: "1995-12-17T02:24:00.000Z",
  text: "cccc",
  likes: 0,
  dislikes: 0,
  user: "61a0c892f320321906365052",
  __v: 0,
  id: "61a0c892f320321906365052",
};

const video = {
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
  id: "61a0c892f320321906365052",
  save: jest.fn(),
};

describe("Given a getComment function", () => {
  describe("When it receives a correct request params, a response and a next function", () => {
    test("Then it should call json method with the comment", async () => {
      const res = mockResponse();
      const req = mockRequest();
      req.params = {
        id: "1"
      };
      Comment.findById = jest.fn().mockResolvedValue(comment);

      await getComment(req, res, null);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(comment);
    });
  });

  describe("When the method findById resolves to a null value", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const req = mockRequest();
      const next = jest.fn();
      req.params = {
        id: "1",
      };
      Comment.findById = jest.fn().mockResolvedValue(null);
      const expectedError = new ErrorCode("Could not get comment");
      expectedError.code = 404;

      await getComment(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the method findById rejects", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const req = mockRequest();
      const next = jest.fn();
      req.params = {
        id: "1",
      };
      Comment.findById = jest.fn().mockRejectedValue({});
      const expectedError = new ErrorCode("General error on getComment");
      expectedError.code = 400;

      await getComment(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a createComment function", () => {
  describe("When it receives a correct request body and params, a response and a next function", () => {
    test("Then it should call json method with the newComment", async () => {
      const res = mockResponse();
      const req = mockRequest();
      req.params = {
        id: "1",
      };
      req.body = comment;
      Video.findOne = jest.fn().mockResolvedValue(video);
      Comment.create = jest.fn().mockResolvedValue(comment);

      await createComment(req, res, null);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(comment);
    });
  });

  describe("When the method create resolves to null", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const req = mockRequest();
      const next = jest.fn();
      req.params = {
        id: "1",
      };
      req.body = comment;
      Comment.create = jest.fn().mockResolvedValue(null);
      const expectedError = new ErrorCode("Could not create comment");
      expectedError.code = 404;

      await createComment(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the method create rejects", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const req = mockRequest();
      const next = jest.fn();
      req.params = {
        id: "1",
      };
      req.body = comment;
      Comment.create = jest.fn().mockRejectedValue({});
      const expectedError = new ErrorCode("Fail on create new comment");
      expectedError.code = 400;

      await createComment(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    
    });
  }); 
});

describe("Given a deleteComment function", () => {
  describe("When it receives a correct request params, a response and a next function", () => {
    test("Then it should call json method with the text \"Succesfully deleted\"", async () => {
      const res = mockResponse();
      const req = mockRequest();
      req.params = {
        idVideo: video.id,
        idComment: comment.id
      };
      Video.findOne = jest.fn().mockResolvedValue(video);
      Comment.findByIdAndRemove = jest.fn().mockResolvedValue(comment);

      await deleteComment(req, res, null);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith("Succesfully deleted");
    });
  });

  describe("When the method findByIdAndRemove resolves to null", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const next = jest.fn();
      const req = mockRequest();
      req.params = {
        idVideo: video.id,
        idComment: comment.id,
      };
      Comment.findByIdAndRemove = jest.fn().mockResolvedValue(null);
      const expectedError = new ErrorCode(
        "Could not find id of comment to remove"
      );
      expectedError.code = 404;

      await deleteComment(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the method findByIdAndRemove rejects", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const next = jest.fn();
      const req = mockRequest();
      req.params = {
        idVideo: video.id,
        idComment: comment.id,
      };
      Comment.findByIdAndRemove = jest.fn().mockRejectedValue({});
      const expectedError = new ErrorCode(
        "Could not delete comment by id from params"
      );
      expectedError.code = 400;

      await deleteComment(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  }); 
});

describe("Given a updateComment function", () => {
  describe("When it receives a correct request params, a response and a next function", () => {
    test("Then it should call json method with the updated comment", async () => {
      const res = mockResponse();
      const req = mockRequest();
      req.params = {
        idComment: comment.id,
      };
      Comment.findByIdAndUpdate = jest.fn().mockResolvedValue(comment);

      await updateComment(req, res, null);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(comment);
    });
  });

  describe("When the method findByIdAndUpdate resolves to null", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const next = jest.fn();
      const req = mockRequest();
      req.params = {
        idComment: comment.id,
      };
      Comment.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      const expectedError = new ErrorCode("Could not update comment of Video");
      expectedError.code = 404;

      await updateComment(req, null, next);      

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the method findByIdAndUpdate rejects", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const next = jest.fn();
      const req = mockRequest();
      req.params = {
        idComment: comment.id,
      };
      Comment.findByIdAndUpdate = jest.fn().mockRejectedValue({});
      const expectedError = new ErrorCode("Could no get id of comment");
      expectedError.code = 400;

      await updateComment(req, null, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });  
});