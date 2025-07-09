import { Server } from "../../../../src/server_app/server/Server";
import { DataBase } from "../../../../src/server_app/data/DataBase";
import { RequestTestWrapper } from "./requestTestWrapper";
import { ResponseTestWrapper } from "./responseTestWrapper";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../../src/server_app/model/ServerModel";

jest.mock("../../../../src/server_app/data/DataBase");

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();

const fakeServer = {
  listen: () => {},
  close: () => {},
};

jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(requestWrapper, responseWrapper);
    return fakeServer;
  },
}));

describe("Register requests test suite", () => {
  afterEach(() => {
    requestWrapper.clearFields();
    responseWrapper.clearFields();
  });

  it("should register new users", async () => {
    requestWrapper.method = HTTP_METHODS.POST;
    requestWrapper.body = {
      userName: "someUserName",
      password: "somePassword",
    };
    requestWrapper.url = "localhost:8080/register";

    jest.spyOn(DataBase.prototype, "insert").mockResolvedValueOnce("1234");

    await new Server().startServer();
    await new Promise(process.nextTick); // this solves timing issues

    expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseWrapper.body).toEqual(
      expect.objectContaining({
        userId: expect.any(String),
      })
    );
  });
});
