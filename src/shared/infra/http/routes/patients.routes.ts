import { Router } from "express";
import { PatientController } from "../../../../modules/patients/controllers/PatientController.js";

const patientsRouter = Router();
const patientController = new PatientController();

patientsRouter.post("/", patientController.handle);

patientsRouter.get("/", patientController.index);

patientsRouter.get("/:id", patientController.show);

patientsRouter.put("/:id", patientController.update);

export { patientsRouter };