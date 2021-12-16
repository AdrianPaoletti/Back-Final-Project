import express from "express";

export interface RequestFire extends express.Request {
  file?: object;
}
