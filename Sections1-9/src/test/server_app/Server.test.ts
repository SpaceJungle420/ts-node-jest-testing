import { RegisterHandler } from "../../../src/server_app/handlers/RegisterHandler";
import { Authorizer } from "../../../src/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../src/server_app/data/ReservationsDataAccess";
import { Server } from "../../../src/server_app/server/Server";
import { LoginHandler } from "../../../src/server_app/handlers/LoginHandler";
import { ReservationsHandler } from "../../../src/server_app/handlers/ReservationsHandler";
import { HTTP_CODES } from "../../../src/server_app/model/ServerModel";

jest.mock("../../../src/server_app/auth/Authorizer");
jest.mock("../../../src/server_app/data/ReservationsDataAccess");
jest.mock("../../../src/server_app/handlers/LoginHandler");
jest.mock("../../../src/server_app/handlers/RegisterHandler");
jest.mock("../../../src/server_app/handlers/ReservationsHandler");

const requestMock = {
  url: "",
  headers: {
    "user-agent": "jest-test",
  },
};

const responseMock = {
  end: jest.fn(),
  writeHead: jest.fn(),
};

const serverMock = {
  listen: jest.fn(),
  close: jest.fn(),
};

jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(requestMock, responseMock);
    return serverMock;
  },
}));

describe("Server test suite", () => {
  let sut: Server;

  beforeEach(() => {
    sut = new Server();
    expect(Authorizer).toHaveBeenCalledTimes(1);
    expect(ReservationsDataAccess).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should start server on port 8080 and end the request", async () => {
    await sut.startServer();

    expect(serverMock.listen).toHaveBeenCalledWith(8080);
    console.log("checking response.end calls: ");
    expect(responseMock.end).toHaveBeenCalled();
  });

  it("should handle register requests", async () => {
    requestMock.url = "loalhost:8080/register";
    const handleRequestSpy = jest.spyOn(
      RegisterHandler.prototype,
      "handleRequest"
    );

    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(RegisterHandler).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });

  it("should handle login requests", async () => {
    requestMock.url = "loalhost:8080/login";
    const handleRequestSpy = jest.spyOn(
      LoginHandler.prototype,
      "handleRequest"
    );

    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(LoginHandler).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });

  it("should handle reservation requests", async () => {
    requestMock.url = "loalhost:8080/reservation";
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );

    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(ReservationsHandler).toHaveBeenCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer),
      expect.any(ReservationsDataAccess)
    );
  });

  it("should do nothing for not supported routes", async () => {
    requestMock.url = "loalhost:8080/someRandomRoute";
    const validateTokenSpy = jest.spyOn(Authorizer.prototype, "validateToken");

    await sut.startServer();

    expect(validateTokenSpy).not.toHaveBeenCalled();
  });

  it("should handle errors in serving requests", async () => {
    requestMock.url = "loalhost:8080/reservation";
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );
    handleRequestSpy.mockRejectedValueOnce(new Error("Some error"));

    await sut.startServer();

    expect(responseMock.writeHead).toHaveBeenCalledWith(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      JSON.stringify(`Internal server error: Some error`)
    );
  });

  it("should stop server", async () => {
    serverMock.close.mockImplementationOnce((cb: Function) => cb());
    await sut.startServer();
    await sut.stopServer();
    expect(serverMock.close).toHaveBeenCalledTimes(1);
  });

  it("should fail to close the server if any error occurs", async () => {
    const someError = new Error("some error");
    serverMock.close.mockImplementationOnce((cb: Function) => cb(someError));
    await sut.startServer();
    await expect(sut.stopServer()).rejects.toThrow(someError);
  });
});
