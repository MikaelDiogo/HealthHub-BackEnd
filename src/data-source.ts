import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from 'dotenv'

import { SinaisVitais } from "./modules/patients/entities/SinaisVitais.js";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASS || "admin",
    database: process.env.DB_NAME || "healthhub",
    synchronize: true,
    logging: false,
    entities: [SinaisVitais],
    migrations: ["src/shared/infra/typeorm/migrations/*.ts"],
    subscribers: [],
});
