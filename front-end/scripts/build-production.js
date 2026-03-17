/**
 * 本番ビルド用スクリプト
 * package.json の homepage を空にしてビルドし、ルートパスで動作する形で出力
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const pkgPath = path.join(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const originalHomepage = pkg.homepage;

try {
  pkg.homepage = "";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  execSync("craco build", { stdio: "inherit", cwd: path.join(__dirname, "..") });
} finally {
  pkg.homepage = originalHomepage;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}
