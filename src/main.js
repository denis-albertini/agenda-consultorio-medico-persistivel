import menuPrincipal from "./view/menuPrincipal.js";
import database from "./database/database.js";
import Result from "./model/result.js";
import output from "./view/output.js";

process.stdout.setDefaultEncoding("utf8");

const initialized = await database.init();

if (!initialized) {
  output(Result.failure(20));
  process.exit(1);
}

while (1) {
  await menuPrincipal();
}
