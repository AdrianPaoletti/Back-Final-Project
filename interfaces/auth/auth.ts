import express from "express";

export interface RequestAuth extends express.Request {
  userId?: string;
  file?: any;
}
