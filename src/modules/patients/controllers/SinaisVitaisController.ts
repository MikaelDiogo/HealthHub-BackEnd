import { Request, Response } from "express";
import { AppDataSource } from "../../../database/data-source.js";
import { SinaisVitais } from "../entities/SinaisVitais.js";

export class SinaisVitaisController {
    async show(req: Request, res: Response){
        const {patientId} = req.params as { patientId : string };
        const repo = AppDataSource.getRepository(SinaisVitais);

        const dados = await repo.find({
            where: { patient_id : patientId},
            order: { hora : "ASC" }

        });

        return res.json(dados);
    }
}