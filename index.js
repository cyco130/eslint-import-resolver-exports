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

    if (pkg.name !== packageName) {
      return { found: false };
    }

    const resolved = resolveExports(pkg, source, config);

    if (!resolved || !resolved.length) {
      return { found: false };
    }

    for (const r of resolved) {
      const moduleId = path.join(path.dirname(pkgFile), r);

      if (fs.existsSync(moduleId)) {
        return { found: true, path: moduleId };
      }
    }

    return { found: false };
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
