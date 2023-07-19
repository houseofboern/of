import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "./db/mongo";
import "./db/redis";

//routes
import { ofRoute } from "./routes/of-route";
import { config } from "./config";
import { router as login } from "./routes/api/login";
import { checkUserAuth } from "./controllers/user-auth";
import { router as siteLoginRouter } from "./routes/api/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Hello world!");
});
app.use("/api/login", login);
app.use("/api/of", checkUserAuth, ofRoute);
app.use(siteLoginRouter);

app.use((_req, res, _next) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Updating the server. Will be up soon!" });
});

app.listen(config.server.port, () => {
  console.log(`Server listening on port ${config.server.port}`);
});
