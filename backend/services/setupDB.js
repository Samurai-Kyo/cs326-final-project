import DB from "./DBService.js";

const db = new DB();
await db.connect();
await db.setup();
await db.disconnect();
