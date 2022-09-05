// @ts-check

const { resolve: resolveExports } = require("resolve.exports");
const path = require("path");
const fs = require("fs");

/**
 * @param {string} source source
 * @param {string} file file
 * @param {import("resolve.exports").Options} config config
 */
const resolve = (source, file, config) => {
  if (source.startsWith(".") || source.startsWith("/")) {
    return { found: false };
  }

  const [packageNameOrScope, packageNameOrPath] = source.split("/", 3);
  const packageName = packageNameOrScope.startsWith("@")
    ? packageNameOrScope + "/" + packageNameOrPath
    : packageNameOrScope;

  try {
    const pkgFile = findPackageJson(path.dirname(file), packageName);
    if (!pkgFile) {
      return { found: false };
    }

    const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));

    const { name, module, main, exports } = pkg;
    const resolved = resolveExports(
      { name, module, main, exports },
      source,
      config
    );

    if (!resolved) {
      return { found: false };
    }

    const moduleId = path.resolve(path.dirname(pkgFile), resolved);

    return { found: true, path: moduleId };
  } catch (err) {
    return { found: false };
  }
};

/**
 * Finds package.json for a package
 *
 * @param {string} filepath
 * @param {string} packageName
 */
function findPackageJson(filepath, packageName) {
  for (;;) {
    const pkgFile = path.join(
      filepath,
      "node_modules",
      packageName,
      "package.json"
    );
    if (fs.existsSync(pkgFile)) {
      return pkgFile;
    }
    const dir = path.dirname(filepath);
    if (dir === filepath) {
      return null;
    }
    filepath = dir;
  }
}

module.exports = {
  interfaceVersion: 2,
  resolve,
};
