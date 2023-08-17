import { createRequire } from "module";
const require = createRequire(import.meta.url);
import * as dotenv from "dotenv";
dotenv.config();

/*teste - deploy ssh*/

import express from "express";
import logger from "morgan";
import cors from "cors";

import "./config/db.config.js";
import matriculasRoutes from "./routes/matriculas.routes.js";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.use("/matriculas", matriculasRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
