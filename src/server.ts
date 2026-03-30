import "reflect-metadata";
import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { routes } from "./shared/infra/http/routes/index.js";
import { AppDataSource } from "./database/data-source.js"; 

const app = express();

app.use(express.json()); 
app.use(cors());     

const SECRET_KEY = "health_hub_mikael_2025";

AppDataSource.initialize()
    .then(() => {
        console.log("Banco de Dados conectado!");
        
        const PORT = 3001;
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Erro ao conectar no Banco de Dados:", error);
    });

app.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`Tentativa de login recebida: ${email}`);

    if (email === "enfermeiro@healthhub.com" && password === "admin123") {
        const token = jwt.sign(
            { nome: "Mikael Diogo", cargo: "Enfermeiro" }, 
            SECRET_KEY, 
            { expiresIn: '1d' } 
        );

        return res.json({
            auth: true,
            token: token,
            message: "Login realizado com sucesso!"
        });
    }

    return res.status(401).json({ 
        auth: false, 
        message: "E-mail ou senha incorretos!" 
    });
});

app.use(routes);