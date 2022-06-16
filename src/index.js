import express, {json} from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";

dotenv.config();

import router from "./routes/index.js";

const app = express();

app.use(cors());
app.use(json());
app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(chalk.blue(`Mode: ${process.env.MODE || "DEV"}`));
  console.log(chalk.blue(`Server is up on port: ${port}`));
});