import { AppDataSource } from "../../../database/data-source.js";
import { Paciente } from "../entities/Pacientes.js";

interface IRequest {
  id: string;
  nome_completo?: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  alergias?: string;
  medicamentos_em_uso?: string;
  anamnese?: string;
}

class UpdatePatientService {
  public async execute(data: IRequest): Promise<Paciente> {
    const repo = AppDataSource.getRepository(Paciente);

    // 1. Localizar o paciente
    const patient = await repo.findOneBy({ id: data.id });

    if (!patient) {
      throw new Error("Paciente não encontrado.");
    }

    // 2. Mesclar os dados novos com os atuais
    Object.assign(patient, data);

    // 3. Salvar as alterações
    return await repo.save(patient);
  }
}

export { UpdatePatientService };