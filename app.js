import { createRequire } from "module";
const require = createRequire(import.meta.url);
import * as dotenv from "dotenv";
dotenv.config();

/*teste - deploy ssh*/

import express from "express";
import logger from "morgan";
import cors from "cors";

import "./config/db.config_postgree.js";
import "./config/db.config.js";

import matriculasRoutes from "./routes/matriculas.routes.js";
import userRoutes from "./routes/users.routes.js";
import userPrivateRoutes from "./routes/userPrivate.routes.js";
import atosRoutes from "./routes/atos.routes.js";
import transformData from "./routes/transformarData.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import authMiddleware from "./middlewares/auth.middlewares.js";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.use("/auth/", userRoutes);

app.use(authMiddleware);

app.use("/user/", userPrivateRoutes);
app.use("/matriculas/", matriculasRoutes);
app.use("/atos", atosRoutes);
app.use("/transform/", transformData);
app.use("/admin/", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
