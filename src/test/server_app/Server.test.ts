import { Authorizer } from "../../../src/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../src/server_app/data/ReservationsDataAccess";
import { Server } from "../../../src/server_app/server/Server";

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
});
