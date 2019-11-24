"use strict";

function extendExpect() {
  expect.extend({
    toBeOneOf(received, array) {
      const pass = array.includes(received);
      if (pass) {
        return {
          message: () => `expected ${received} not to be one of ${array}`,
          pass: true
        };
      } else {
        return {
          message: () => `expected ${received} to be one of ${array}`,
          pass: false
        };
      }
    }
  });
}

module.exports = {
  extendExpect
};
