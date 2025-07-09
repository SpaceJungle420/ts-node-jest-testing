import { HTTP_CODES } from "../../../../src/server_app/model/ServerModel";

export class ResponseTestWrapper {
  public statusCode: HTTP_CODES;
  public headers = new Array<object>();
  public body: object;
  public end = jest.fn();

  public writeHead(statusCode: HTTP_CODES, header: object) {
    this.statusCode = statusCode;
    this.headers.push(header);
  }

  public write(stringifyBody: string) {
    this.body = JSON.parse(stringifyBody);
  }

  public clearFields() {
    this.statusCode = undefined;
    this.headers = [];
    this.headers.length = 0;
    this.end.mockClear();
  }
}
