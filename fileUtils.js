const fs = require("fs");
const cheerio = require("cheerio");
const crypto = require("crypto");
const prettier = require("prettier");

const getHashFile = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);

  return hashSum.digest("hex");
};

const updateBundleVersion = (indexFilePath, bundleId) => {
  fs.readFile(indexFilePath, "utf8", (err, data) => {
    const $ = cheerio.load(data, { xmlMode: false });

    if (err) {
      return console.log(err);
    }

    $("#bundle-file").replaceWith(
      `<script id="bundle-file" src="{{ url_for('static', filename='dist/bundle.js') }}?v=${bundleId}"></script>`
    );

    const contentFormatted = prettier.format($.html(), { parser: "html" });

    fs.writeFileSync(indexFilePath, contentFormatted, { encoding: "utf-8" });
  });
};

module.exports = { getHashFile, updateBundleVersion };
