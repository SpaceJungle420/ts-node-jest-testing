import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../server_app/auth/Authorizer";
import { RegisterHandler } from "../../../server_app/handlers/RegisterHandler";
import { getRequestBody } from "../../../server_app/utils/Utils";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../server_app/model/ServerModel";
import { LoginHandler } from "../../../server_app/handlers/LoginHandler";
import { Account } from "../../../server_app/model/AuthModel";

const getRequestBodyMock = jest.fn();

jest.mock("../../../server_app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("LoginHandler test suite", () => {
  let sut: LoginHandler;

  const request = {
    method: undefined,
  };

  const responseMock = {
    writeHead: jest.fn(),

    write: jest.fn(),

    statusCode: 0,
  };

  const authorizerMock = {
    login: jest.fn(),
  };

  const someToken = "1234";

  const someAccount: Account = {
    id: "",

    password: "somePassword",

    userName: "someUserName",
  };

  beforeEach(() => {
    sut = new LoginHandler(
      request as IncomingMessage,

      responseMock as any as ServerResponse,

      authorizerMock as any as Authorizer
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return token for valid accounts in requests", async () => {
    request.method = HTTP_METHODS.POST;

    getRequestBodyMock.mockResolvedValueOnce(someAccount);

    authorizerMock.login.mockResolvedValueOnce(someToken);

    await sut.handleRequest();

    expect(authorizerMock.login).toHaveBeenCalledWith(
      someAccount.userName,

      someAccount.password
    );

    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);

    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });

    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify({
        token: someToken,
      })
    );
  });

  it("should return not found for invalid accounts in requests", async () => {
    request.method = HTTP_METHODS.POST;

    getRequestBodyMock.mockResolvedValueOnce(someAccount);

    authorizerMock.login.mockResolvedValueOnce(undefined);

    await sut.handleRequest();

    expect(authorizerMock.login).toHaveBeenCalledWith(
      someAccount.userName,

      someAccount.password
    );

    expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);

    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("wrong username or password")
    );
  });

  it("should return bad request for invalid requests", async () => {
    request.method = HTTP_METHODS.POST;

    getRequestBodyMock.mockResolvedValueOnce({});

    await sut.handleRequest();

    expect(authorizerMock.login).not.toHaveBeenCalledWith();

    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);

    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("userName and password required")
    );
  });

  it("should do nothing for not supported http methods", async () => {
    request.method = HTTP_METHODS.GET;

    await sut.handleRequest();

    expect(responseMock.writeHead).not.toHaveBeenCalledWith();

    expect(responseMock.write).not.toHaveBeenCalledWith();

    expect(getRequestBodyMock).not.toHaveBeenCalledWith();
  });
});
