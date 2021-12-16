import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request } from "express";
import { mockResponse } from "../utils/mocks/mockFunction";
import User from "../../database/model/user";
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
} from "./usersController";
import { RequestAuth } from "../../interfaces/auth/auth";

jest.mock("../../database/model/user.ts");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

class ErrorCode extends Error {
  code: number | undefined;
}

describe("Given a usersController controller", () => {
  describe("When the user registers with a name, an username that doesn't already exists and a password", () => {
    test("Then it should create a new user", async () => {
      const user = {
        name: "raul",
        username: "raul",
        password: "raul",
        avatar: "raul",
      };
      const req = { body: user, file: { fileURL: user.avatar } };
      const res = mockResponse();
      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue(user);
      bcrypt.hash = jest.fn().mockResolvedValue("raul");
      await registerUser(req, res, null);

      expect(User.create).toHaveBeenCalledWith(user);
    });
  });

  describe("When the user registers with a name, an username that already exists and a password", () => {
    test("Then it should get rejected with a 404 error", async () => {
      const expectedError = new ErrorCode(
        "Username already exists, please change it"
      );
      expectedError.code = 404;
      const user = {
        name: "raul",
        username: "raul",
        password: "raul",
        avatar: "raul",
      };
      const req = { body: user, file: { fileURL: user.avatar } };
      const res = mockResponse();
      User.findOne = jest.fn().mockResolvedValue("raul");
      const next = jest.fn();
      await registerUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the users register with an invlaid username", () => {
    test("Then it should reject with a 400 code error", async () => {
      const error = new ErrorCode();
      error.code = 400;
      const user = {
        name: "raul",
        username: "raul",
        password: "raul",
        avatar: "raul",
      };
      const req = {
        body: user,
        file: { fileURL: user.avatar },
      };
      const res = mockResponse();
      const next = jest.fn();
      User.findOne = jest.fn().mockRejectedValue({});
      await registerUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When the username is correct but it is not posible to create the user", () => {
    test("Then it should call next funcion with an 404 error code", async () => {
      const expectedError = new ErrorCode("Not possible to create a new user");
      expectedError.code = 404;
      const user = {
        name: "raul",
        username: "raul",
        password: "raul",
        avatar: "raul",
      };
      const req = {
        body: user,
        file: { fileURL: user.avatar },
      };
      const res = mockResponse();
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.hash = jest.fn().mockResolvedValue("raul");
      User.create = jest.fn().mockResolvedValue(null);

      await registerUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When a user tries to log with an incorrect username", () => {
    test("Then it should call next function with an 401 error code", async () => {
      const user = {
        username: "raul",
        password: "raul",
      };
      const req = { body: user } as Request;
      const res = mockResponse();
      const next = jest.fn();
      const expectedError = new ErrorCode("Incorrect username");
      expectedError.code = 401;
      User.findOne = jest.fn().mockResolvedValue(null);

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When it receives a right username and a wrong password", () => {
    test("Then it should call next function with a 401 error", async () => {
      const user = {
        username: "raul",
        password: "raul",
      };
      const req = { body: user } as Request;
      User.findOne = jest.fn().mockResolvedValue({
        username: "raul",
        password: "raul",
      });
      const next = jest.fn().mockResolvedValue(false);
      bcrypt.compare = jest.fn();
      const expectedError = new ErrorCode("Incorrect password");
      expectedError.code = 401;

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When user gets logged with a right username and password", () => {
    test("Then it should call res.json with a new token", async () => {
      const user = {
        username: "raul",
        password: "raul",
      };
      const req = { body: user } as Request;
      User.findOne = jest.fn().mockResolvedValue({
        username: "raul",
        password: "raul",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("asdf");
      const res = mockResponse();
      const expectedResponse = {
        token: "asdf",
      };

      await loginUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When the request body is incorrect", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const user = {
        username: "raul",
        password: "raul",
      };
      const req = { body: user } as Request;
      const res = mockResponse();
      const next = jest.fn();
      User.findOne = jest.fn().mockRejectedValue({});
      const expectedError = new ErrorCode();
      expectedError.code = 400;

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a getUser function", () => {
  describe("When it receives a request, a response and a next function", () => {
    test("Then it should call the method json with the userSearched", async () => {
      const user = {
        name: "ab",
        username: "ab",
        password: "ab",
        avatar:
          "https://storage.googleapis.com/finalproject-8e75f.appspot.com/airplane-jump-1637932169665-.jpg",
        favouriteVideos: [],
        myVideos: [],
        __v: 0,
        id: "61a0dc8b7ed9713779a3c69a",
      };
      const res = mockResponse();
      const req = { userId: user.id } as RequestAuth;
      User.findById = jest.fn().mockResolvedValue(user);

      await getUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe("When the method findById return a null value", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const res = mockResponse();
      const req = { userId: null } as RequestAuth;
      const next = jest.fn();
      User.findById = jest.fn().mockResolvedValue(null);
      const expectedError = new ErrorCode("Could not find the id of user");
      expectedError.code = 404;

      await getUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When the method findById can not be executed", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const res = mockResponse();
      const req = { userId: null } as RequestAuth;
      const next = jest.fn();
      User.findById = jest.fn().mockRejectedValue({});
      const expectedError = new ErrorCode("Could not get user");
      expectedError.code = 400;

      await getUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given a updateUser function", () => {
  describe("When it receives a request, a response and a next function", () => {
    test("Then it should call the method json with the updatedUser", async () => {
      const user = {
        name: "ab",
        username: "ab",
        password: "ab",
        avatar:
          "https://storage.googleapis.com/finalproject-8e75f.appspot.com/airplane-jump-1637932169665-.jpg",
        favouriteVideos: [],
        myVideos: [],
        __v: 0,
        id: "61a0dc8b7ed9713779a3c69a",
      };
      const res = mockResponse();
      const req = {
        userId: user.id,
        body: user,
        file: { fileURL: user.avatar },
      } as RequestAuth;
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(user);
      bcrypt.hash = jest.fn().mockResolvedValue(user.password);

      await updateUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  /* describe("When the findByIdAndUpdate method resolves to null", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const res = mockResponse();
      const req = { userId: "ab" } as RequestAuth;
      const next = jest.fn();
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      const expectedError = new ErrorCode("Could not update");
      expectedError.code = 404;
      await updateUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  }); */

  describe("When the findByIdAndUpdate method rejects", () => {
    test("Then it should call next function with a 400 error code", async () => {
      const res = mockResponse();
      const req = { userId: null } as RequestAuth;
      const next = jest.fn();
      User.findByIdAndUpdate = jest.fn().mockRejectedValue({});
      const expectedError = new ErrorCode("General error on update user");
      expectedError.code = 400;
      await updateUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given an deleteUser function", () => {
  describe("When the function is called with a correct request, a response and a next function", () => {
    test('Then it should call the json method with the text "User deleted"', async () => {
      const user = {
        name: "ab",
        username: "ab",
        password: "ab",
        avatar:
          "https://storage.googleapis.com/finalproject-8e75f.appspot.com/airplane-jump-1637932169665-.jpg",
        favouriteVideos: [],
        myVideos: [],
        __v: 0,
        id: "61a0dc8b7ed9713779a3c69a",
      };
      const req = { userId: user.id } as RequestAuth;
      const res = mockResponse();
      User.findByIdAndRemove = jest.fn().mockResolvedValue(user);

      await deleteUser(req, res, null);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith("User deleted");
    });
  });

  describe("When the findByIdAndRemove method resolves to null", () => {
    test("Then it should call next function with a 404 error code", async () => {
      const req = { userId: null } as RequestAuth;
      const res = mockResponse();
      const next = jest.fn();
      User.findByIdAndRemove = jest.fn().mockResolvedValue(null);
      const expectedError = new ErrorCode("Could not delete user");
      expectedError.code = 404;

      await deleteUser(req, res, next);

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
      const req = { userId: null } as RequestAuth;
      const res = mockResponse();
      const next = jest.fn();
      User.findByIdAndRemove = jest.fn().mockRejectedValue({});
      const expectedError = new ErrorCode("Could not get id from user");
      expectedError.code = 400;

      await deleteUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});
