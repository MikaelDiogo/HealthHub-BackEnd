import { Router } from "express";
import { SinaisVitaisController } from "../controllers/SinaisVitaisController.js";

const sinaisRouter = Router();
const sinaisController = new SinaisVitaisController();

sinaisRouter.get('/:patientId/vitals', sinaisController.show);

export { sinaisRouter };
