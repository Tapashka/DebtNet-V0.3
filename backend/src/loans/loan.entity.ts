import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type LoanDirection = 'lent' | 'borrowed';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner_id: string;

  @Column()
  counterparty_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'BYN' })
  currency: string;

  @Column()
  direction: LoanDirection;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  is_settled: boolean;

  @CreateDateColumn()
  created_at: Date;
}
