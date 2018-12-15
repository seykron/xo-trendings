import { isNullOrUndefined } from "util";

function createVerify(mock, invocations) {
  return () => {
    for (let invocation of invocations) {
      if (isNullOrUndefined(invocation.args)) {
        expect(mock[invocation.method]).toBeCalled();
      } else {
        expect(mock[invocation.method]).toBeCalledWith.call(mock, invocation.args);
      }
    }  
  };
}

export class Mock {

  invocations = [];
  mock = {};

  invoke(method, returnValue, args) {
    if (!this.mock.hasOwnProperty(method)) {
      this.mock[method] = jest.fn();
      this.mock.verify = createVerify(this.mock, this.invocations);
    }

    this.invocations.push({
      method: method,
      args: args
    });

    this.mock[method].mockReturnValueOnce(returnValue);

    return this;
  }
}
