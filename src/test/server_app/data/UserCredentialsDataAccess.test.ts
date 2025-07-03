import { Account } from "../../../server_app/model/AuthModel";
import { DataBase } from "../../../server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../server_app/data/UserCredentialsDataAccess";

const insertMock = jest.fn();
const getByMock = jest.fn();

jest.mock("../../../server_app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        getBy: getByMock,
      };
    }),
  };
});

describe("UserCredentialsDataAccess test suite", () => {
  let sut: UserCredentialsDataAccess;

  const someAccount: Account = {
    id: "",
    password: "somePassword",
    userName: "someUserName",
  };

  const someId = "1234";

  beforeEach(() => {
    sut = new UserCredentialsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add user and return the id", async () => {
    insertMock.mockResolvedValueOnce(someId);

    const actuald = await sut.addUser(someAccount);

    expect(actuald).toBe(someId);
    expect(insertMock).toHaveBeenCalledWith(someAccount);
  });

  it("should get user by id", async () => {
    getByMock.mockResolvedValueOnce(someAccount);

    const actualUser = await sut.getUserById(someId);

    expect(actualUser).toEqual(someAccount);
    expect(getByMock).toHaveBeenCalledWith("id", someId);
  });

  it("should get user by name", async () => {
    getByMock.mockResolvedValueOnce(someAccount);

    const actualUser = await sut.getUserByUserName(someAccount.userName);

    expect(actualUser).toEqual(someAccount);
    expect(getByMock).toHaveBeenCalledWith("userName", someAccount.userName);
  });
});
