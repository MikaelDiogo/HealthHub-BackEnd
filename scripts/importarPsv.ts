import "reflect-metadata";
import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../src/database/data-source.js';
import { SinaisVitais } from '../src/modules/patients/entities/SinaisVitais.js';
import { Paciente } from "../src/modules/patients/entities/Pacientes.js";

async function importar() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        console.log("Conexão estabelecida! Iniciando carga sincronizada...");

        const repoSinais = AppDataSource.getRepository(SinaisVitais);
        const repoPatient = AppDataSource.getRepository(Paciente);
        
        const diretorio = path.join(process.cwd(), 'data', 'training_setA');
        
        if (!fs.existsSync(diretorio)) {
            console.error(`❌ Pasta não encontrada: ${diretorio}`);
            return;
        }

        const arquivos = fs.readdirSync(diretorio).filter(f => f && f.endsWith('.psv')).slice(0, 80);

        for (const arquivo of arquivos) {
            if (!arquivo) continue;

            const conteudo = fs.readFileSync(path.join(diretorio, arquivo), 'utf-8');
            const linhas = conteudo.split('\n').filter(l => l.trim() !== '');
            
            if (linhas.length < 2) continue; 

            // 1. Pegar dados da última linha para o cadastro do Paciente
            const ultimaLinha = linhas[linhas.length - 1];
            if (!ultimaLinha) continue;

            const ultimaLinhaCol = ultimaLinha.split('|');
            
            // SOLUÇÃO: Extrair com fallback para string vazia '' antes do parseFloat
            const idadeBruta = ultimaLinhaCol[34] ?? ''; 
            const sexoBruto = ultimaLinhaCol[35] ?? '';
            
            const idade = parseFloat(idadeBruta) || 0;
            const sexoNum = sexoBruto.trim(); 
            
            const nomePaciente = `Paciente ${arquivo.replace('.psv', '')}`;

            // 2. Criar ou Encontrar o Paciente
            let paciente = await repoPatient.findOneBy({ nome_completo: nomePaciente });
            
            if (!paciente) {
               const novoPaciente = repoPatient.create({
        nome_completo: nomePaciente,
        idade: Math.floor(idade),
        sexo: sexoNum === '1' ? 'Masculino' : 'Feminino',
        // USANDO O NOME DO ARQUIVO PARA EVITAR O ERRO DE UNIQUE CONSTRAINT
        cpf: arquivo.replace('.psv', ''), 
        telefone: '(88) 0000-0000',
        anamnese: `Dados importados do arquivo ${arquivo}`
    });
    paciente = await repoPatient.save(novoPaciente);
            }

            if (!paciente || !paciente.id) continue;

            const registrosParaSalvar: any[] = [];
            
            // 3. Processar Sinais Vitais
            for (let i = 1; i < linhas.length; i++) {
                const linhaAtual = linhas[i];
                if (!linhaAtual) continue; 

                const col = linhaAtual.split('|');
                if (col.length < 3) continue;

                // Garantindo que col[index] não seja undefined usando o operador ??
                registrosParaSalvar.push({
                    patient_id: paciente.id,
                    hora: i - 1,
                    frequencia_cardiaca: (col[0] && col[0] !== 'NaN') ? parseFloat(col[0] ?? '0') : undefined,
                    saturacao_oxigenio: (col[1] && col[1] !== 'NaN') ? parseFloat(col[1] ?? '0') : undefined,
                    temperatura: (col[2] && col[2] !== 'NaN') ? parseFloat(col[2] ?? '0') : undefined,
                    pressao_arterial: `${col[3] ?? '--'}/${col[5] ?? '--'}`
                });
            }

            if (registrosParaSalvar.length > 0) {
                const entidadesSinais = repoSinais.create(registrosParaSalvar);
                await repoSinais.save(entidadesSinais);
                console.log(`✅ ${arquivo} -> ${paciente.nome_completo} processado.`);
            }
        }
        console.log("🚀 Carga finalizada com sucesso!");
    } catch (err) {
        console.error("❌ Erro fatal:", err);
    } finally {
        if (AppDataSource.isInitialized) await AppDataSource.destroy();
    }
}

importar();