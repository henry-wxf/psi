class InvalidParameter extends Error {

    constructor(input = {}, ...params) {
        super(...params);

        this.input = input;

        // a workaround to make `instanceof InvalidParameter` work in ES5
        //https://github.com/babel/babel/issues/4485#issuecomment-315569892
        this.constructor = InvalidParameter
        this.__proto__ = InvalidParameter.prototype

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidParameter);
        }

    }
}

export default InvalidParameter;