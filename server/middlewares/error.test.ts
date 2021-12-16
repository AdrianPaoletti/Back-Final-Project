import { notFoundErrorHandler, generalErrorHandler } from "./error"

interface IResponse {
  status: () => void;
  json: () => void;
}
class ErrorCode extends Error {
  code: number | undefined;
}

const mockResponse = () => {
  const res: IResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("Given a notFoundErrorHandler", () => {
  describe("When it receives a null request", () => {
    test("Then it should return an error with 404 code and message Not Endpoint found", () => {
      const expectedError = new ErrorCode("Endpoint not found");
      expectedError.code = 404;
      const errorMessage = {
        error: expectedError.message
      };
      const res = mockResponse();
      notFoundErrorHandler(null, res)

      expect(res.status).toHaveBeenCalledWith(expectedError.code);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    })
  })
})

describe("Given a generalErrorHandler", () => {
  describe("When it receives an error and res", () => {
    test("Then it should invoke the method status and json", () => {
      const expectedError = new ErrorCode("General error");
      expectedError.code = 500;
      const res = mockResponse();
      const errorMessage = {
        error: expectedError.message,
      };
      generalErrorHandler(expectedError, null, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedError.code);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
});