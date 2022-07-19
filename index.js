// @ts-check

const { resolve: resolveExports } = require("resolve.exports");
const path = require("path");
const fs = require("fs");

/**
 * @param {string} source source
 * @param {string} file file
 * @param {Object} _config config
 */
const resolve = (source, file, _config) => {
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
    const resolved = resolveExports({ name, module, main, exports }, source);

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
  filepath = filepath.replace(/\/$/, "/");
  while (filepath !== "/") {
    const pkgFile = filepath + "/node_modules/" + packageName + "/package.json";
    if (fs.existsSync(pkgFile)) {
      return pkgFile;
    }
    filepath = path.dirname(filepath);
  }

  return null;
}

module.exports = {
  interfaceVersion: 2,
  resolve,
};
