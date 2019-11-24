const fs = require("fs");

function writeFile(name, content) {
  fs.writeFile(name, content, "ascii", err => {
    if (err) {
      throw err;
    }
  });
}

module.exports = {
  writeFile
};
