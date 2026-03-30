import { Router } from "express";
import { SinaisVitaisController } from "../../../../modules/patients/controllers/SinaisVitaisController.js";

const sinaisRouter = Router();
const sinaisController = new SinaisVitaisController();


sinaisRouter.post("/:id", sinaisController.handle);

sinaisRouter.get('/:patientId/vitals', sinaisController.show);

export { sinaisRouter };
