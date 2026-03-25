import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("sinais_vitais")
export class SinaisVitais {
    @PrimaryGeneratedColumn()
    id!: number; 

    @Column()
    patient_id!: string;

    @Column()
    hora!: number;

    @Column({ type: "float", nullable: true })
    frequencia_cardiaca?: number; 

    @Column({ type: "float", nullable: true })
    saturacao_oxigenio?: number;

    @Column({ type: "float", nullable: true })
    temperatura?: number;

    @CreateDateColumn()
    created_at!: Date;
    paciente: any;
}