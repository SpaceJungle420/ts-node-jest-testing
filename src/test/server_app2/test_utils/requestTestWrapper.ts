import { HTTP_METHODS } from "../../../server_app/model/ServerModel";

export class RequestTestWrapper {
  public body: object;
  public method: HTTP_METHODS;
  public url: string;
  public headers: Record<string, string> = {
    "user-agent": "jest-test-agent",
  };

  public on(event, cb) {
    if (event == "data") {
      cb(JSON.stringify(this.body));
    } else {
      cb();
    }
  }

  public clearFields() {
    this.body = undefined;
    this.method = undefined;
    this.url = undefined;
    this.headers = {
      "user-agent": "jest-test-agent",
    };
  }
}
