import { Request, Response } from "express";

const mockRequest = () => {
  const req = {} as Request;
  return req;
}

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
}

export { mockRequest, mockResponse };