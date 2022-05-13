const { validate } = require("schema-utils");
const { getHashFile, updateBundleVersion } = require("./fileUtils");

// schema for options object
const schema = {
  type: "object",
  properties: {
    indexFile: {
      type: "string",
    },
  },
};

class BundleVersionWebpackPlugin {
  static defaultOptions = {
    indexFile: "./static/index.html",
  };

  constructor(options = {}) {
    validate(schema, options, {
      name: "Bundle Version Webpack Plugin",
      baseDataPath: "options",
    });

    this.options = { ...BundleVersionWebpackPlugin.defaultOptions, ...options };
  }

  apply(compiler) {
    compiler.hooks.assetEmitted.tap(
      "Bundle Version Webpack Plugin",
      (file, { targetPath }) => {
        const bundleHash = getHashFile(targetPath);
        const indexFile = this.options.indexFile;

        updateBundleVersion(indexFile, bundleHash);
      }
    );
  }
}

module.exports = BundleVersionWebpackPlugin;
