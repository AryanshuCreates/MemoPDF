const fs = require("fs");
const path = require("path");

const storagePath = path.join(__dirname, "storage.json");

function load() {
  if (!fs.existsSync(storagePath)) return {};

  try {
    const content = fs.readFileSync(storagePath, "utf-8").trim();
    if (!content) return {}; // handle empty file
    return JSON.parse(content);
  } catch (e) {
    console.error("Error reading storage.json:", e);
    return {};
  }
}

function save(data) {
  fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
}

module.exports = { load, save };
