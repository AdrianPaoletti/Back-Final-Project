import jwt from "jsonwebtoken";
import Auth from "./auth";
import { mockResponse , mockRequest} from "../utils/mocks/mockFunction";

jest.mock("jsonwebtoken");
class ErrorCode extends Error {
  code: number | undefined;
}

describe("Given an auth function", () => {
  describe("When the user authorization is undefined or doesn't exists", () => {
    test("Then it should call next function with a 401 error", () => {
      const req = mockRequest();
      req.header = jest.fn();
      const res = mockResponse();
      const next = jest.fn();
      const expectedError = new ErrorCode("You are unauthorizated");
      expectedError.code = 401;

      Auth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When the user is authorized but the token is broken", () => {
    test("Then it should call next function with an 401 error", () => {
      const req = mockRequest();
      req.header = jest.fn().mockReturnValue("546");
      const next = jest.fn();
      const res = mockResponse();
      const expectedError = new ErrorCode("Could not find token");
      expectedError.code = 401;

      Auth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When a token exists but that one is not valid", () => {
    test("Then it should call next function with an 401 error", () => {});
      const req = mockRequest();
    req.header = jest.fn().mockReturnValue("de asdf123");
    const next = jest.fn();
    const res = mockResponse();
    const expectedError = new ErrorCode("Invalid authorization");
    expectedError.code = 401;

    Auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expectedError);
    expect(next.mock.calls[0][0]).toHaveProperty(
      "message",
      expectedError.message
    );
    expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
  });

  describe("When a token exists and is valid", () => {
    test("Then it should call next function with no error", () => {});
    const req = mockRequest();
    req.header = jest.fn().mockReturnValue("de asdf123");
    const next = jest.fn();
    const res = mockResponse();
    jwt.verify = jest.fn().mockReturnValue({});
    const expectedError = new ErrorCode("Invalid authorization");
    expectedError.code = 401;

    Auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expectedError);
    });
});