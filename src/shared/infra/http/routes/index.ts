import { Router } from "express";
import { sinaisRouter } from "./sinais.routes.js";
import { patientsRouter } from "./patients.routes.js";

const routes = Router();

// Organização por prefixo:
routes.use("/patients", patientsRouter);
routes.use("/sinais", sinaisRouter);     

export { routes };