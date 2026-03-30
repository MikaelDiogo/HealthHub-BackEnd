import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Paciente } from "./Pacientes.js";

@Entity("sinais_vitais")
export class SinaisVitais {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // Ajustado para string, pois UUID não é número

    @Column({ type : "uuid" })
    patient_id!: string;

    @Column()
    hora!: number;

    @Column({ type: "float", nullable: true })
    frequencia_cardiaca?: number; 

    @Column({ type: "float", nullable: true })
    saturacao_oxigenio?: number;

    @Column({ nullable: true })
    pressao_arterial?: string; // Use '?' pois pode ser nulo

    @Column({ type: "float", nullable: true })
    temperatura?: number;

    @CreateDateColumn()
    created_at!: Date;

    // REMOVI A LINHA "paciente: any;" DAQUI

    @ManyToOne(() => Paciente, (paciente) => paciente.sinaisVitais, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "patient_id" })
    paciente!: Paciente; 
}