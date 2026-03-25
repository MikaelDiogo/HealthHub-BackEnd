import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SinaisVitais } from "./SinaisVitais.js";

@Entity("pacientes")
export class Paciente {
    @PrimaryGeneratedColumn("uuid")
    id!: string; 

    @Column()
    nome_completo!: string;

    @Column({ unique: true })
    cpf!: string;

    @Column({ nullable: true })
    rg?: string; 

    @Column()
    idade!: number;

    @Column()
    sexo!: string;

    @Column({ nullable: true })
    telefone?: string;

    @Column({ type: "text", nullable: true })
    endereco?: string;

    //Parte Estatica: Os dados que eram em hospitalares, serao migrados para a tabela pacientes

    @Column({ type: "text", nullable: true })
    alergias?: string; // 

    @Column({ type: "text", nullable: true })
    medicamentos_em_uso?: string; // 

    @Column({ type: "text", nullable: true })
    anamnese?: string; //

    @OneToMany(() => SinaisVitais, (sinais) => sinais.paciente)
    sinaisVitais!: SinaisVitais[];
}