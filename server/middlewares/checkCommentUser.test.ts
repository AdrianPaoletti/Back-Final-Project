import Comment from "../../database/model/comment";
import checkCommentUser from "./checkCommentUser";
import {RequestAuth} from "../../interfaces/auth/auth";
import { mockRequest } from "../utils/mocks/mockFunction";

jest.mock("../../database/model/comment");

const comment = {
  date: "1995-12-17T02:24:00.000Z",
  text: "cccc",
  likes: 0,
  dislikes: 0,
  user: "61a0c892f320321906365052",
  __v: 0,
  id: "61a0c892f320321906365052",
};

class ErrorCode extends Error {
  code: number | undefined;
}

describe("Given a checkCommentUser function", () => {
  describe("When the id of the user is the same of the comment user", () => {
    test("Then it should call next function empty", async () => {
      const req = mockRequest() as RequestAuth;
      const next = jest.fn();
      req.userId = "61a0c892f320321906365052";
      req.params = {
        idComment: "61a0c892f320321906365052",
      }
      Comment.findById = jest.fn().mockResolvedValue(comment);

      await checkCommentUser(req, null, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("When the id of the user is the different to the comment user", () => {
    test("Then it should call next function with an error", async () => {
      const req = mockRequest() as RequestAuth;
      const next = jest.fn();
      req.userId = "61a0c892f320321906365058";
      req.params = {
        idComment: "61a0c892f320321906365052",
      };
      const expectedError = new ErrorCode("User not allowed");
      expectedError.code = 401;
      Comment.findById = jest.fn().mockResolvedValue(comment);

      await checkCommentUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    
    });
  });

  describe("When the method findById rejects", () => {
    test("Then it should call next function with an error 400", async () => {
      const req = mockRequest();
      req.params = {
        idComment: "61a0c892f320321906365052",
      };
      const next = jest.fn();
      const expectedError = new ErrorCode("Can not find the comment");
      expectedError.code = 400;
      Comment.findById = jest.fn().mockRejectedValue({});

      await checkCommentUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

