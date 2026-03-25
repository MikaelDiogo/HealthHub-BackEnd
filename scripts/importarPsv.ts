import "reflect-metadata";
import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../src/database/data-source.js';
import { SinaisVitais } from '../src/modules/patients/entities/SinaisVitais.js';

async function importar() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        console.log("Conexão estabelecida! Iniciando carga...");

        const repo = AppDataSource.getRepository(SinaisVitais);
        const diretorio = path.join(process.cwd(), 'data', 'training_setA');
        
        if (!fs.existsSync(diretorio)) {
            console.error(`Pasta não encontrada: ${diretorio}`);
            return;
        }

        const arquivos = fs.readdirSync(diretorio).slice(0, 50);
        console.log(`Processando ${arquivos.length} arquivos...`);

        for (const arquivo of arquivos) {
            if (arquivo.endsWith('.psv')) {
                const conteudo = fs.readFileSync(path.join(diretorio, arquivo), 'utf-8');
                const linhas = conteudo.split('\n').slice(1);
                
                const registrosParaSalvar: SinaisVitais[] = [];

                for (let i = 0; i < linhas.length; i++) {
                    const linhaBruta = linhas[i];
                    
                
                    if (!linhaBruta) continue;

                    const linha = linhaBruta.trim();
                    if (!linha) continue;

                    const col = linha.split('|');
                    if (col.length < 3) continue;
                    
                    const dados: any = {
                        patient_id: arquivo.replace('.psv', ''),
                        hora: i,
                        frequencia_cardiaca: (col[0] && col[0] !== 'NaN') ? parseFloat(col[0]) : undefined,
                        saturacao_oxigenio: (col[1] && col[1] !== 'NaN') ? parseFloat(col[1]) : undefined,
                        temperatura: (col[2] && col[2] !== 'NaN') ? parseFloat(col[2]) : undefined,
                    };

                   const entidade = repo.create(dados as any) as unknown as SinaisVitais;
                    registrosParaSalvar.push(entidade);
                }

                if (registrosParaSalvar.length > 0) {
                    await repo.save(registrosParaSalvar);
                    console.log(`${arquivo} importado com ${registrosParaSalvar.length} registros.`);
                }
            }
        }
        console.log("Carga finalizada com sucesso!");
    } catch (err) {
        console.error("Erro fatal:", err);
    } finally {
        if (AppDataSource.isInitialized){
             await AppDataSource.destroy();
        }
       
    }
}

importar();