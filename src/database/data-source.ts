import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';

// 1. Mantenha o .js aqui (O TS exige isso no modo nodenext)
import { SinaisVitais } from "../modules/patients/entities/SinaisVitais.js";
import { Paciente } from "../modules/patients/entities/Pacientes.js";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASS || "admin",
    database: process.env.DB_NAME || "healthhub",
    synchronize: false, // Mantenha false para usar migrations
    logging: true,
    
    // 2. Use as classes importadas diretamente
    entities: [SinaisVitais, Paciente],
    
    // 3. Nas migrations, use uma busca que aceite tanto .ts quanto .js
    migrations: ["src/database/migrations/*.{ts,js}"],
    subscribers: [],
});