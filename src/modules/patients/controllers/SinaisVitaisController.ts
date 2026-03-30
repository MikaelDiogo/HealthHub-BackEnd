import { Request, Response } from "express";
import { AppDataSource } from "../../../database/data-source.js";
import { SinaisVitais } from "../entities/SinaisVitais.js";
import { CreateSinaisVitaisService } from "../services/CreateSinaisVitaisService.js";

export class SinaisVitaisController {
    
    // MÉTODO: BUSCAR HISTÓRICO (GET)
    async show(req: Request, res: Response) {
        const { patientId } = req.params as { patientId: string };
        const repo = AppDataSource.getRepository(SinaisVitais);

        try {
            if (!patientId) {
                return res.status(400).json({ error: "ID do paciente não fornecido." });
            }

            const dados = await repo.find({
                where: { patient_id: patientId },
                order: { created_at: "DESC" } // Garante que o mais novo venha primeiro
            });

            return res.json(dados);
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: "Erro interno ao buscar sinais vitais." });
        }
    }

    // MÉTODO: CRIAR NOVO REGISTRO (POST)
    async handle(request: Request, response: Response): Promise<Response> {
        // Pega o ID da URL (:id) ou do corpo da requisição
        const patient_id = request.params.id || request.body.patient_id;

        const { 
            frequencia_cardiaca, 
            saturacao_oxigenio, 
            pressao_arterial, 
            temperatura,
            hora // Caso você queira enviar um número manualmente
        } = request.body;

        if (!patient_id) {
            return response.status(400).json({ error: "O ID do paciente é obrigatório." });
        }

        // LÓGICA DE CONVERSÃO PARA INTEGER:
        // Se 'hora' não vier no body, criamos um número baseado no relógio atual (Ex: 14:05 -> 1405)
        const agora = new Date();
        const horaFormatada = hora 
            ? Number(hora) 
            : Number(`${agora.getHours()}${agora.getMinutes().toString().padStart(2, '0')}`);

        const createSinais = new CreateSinaisVitaisService();

        try {
            const sinais = await createSinais.execute({
                patient_id,
                hora: horaFormatada, // Agora passamos o campo obrigatório como Number
                frequencia_cardiaca,
                saturacao_oxigenio,
                pressao_arterial,
                temperatura
            });

            return response.status(201).json(sinais);
        } catch (err: any) {
            return response.status(400).json({ 
                error: err.message || "Erro ao salvar sinais vitais." 
            });
        }
    }
}