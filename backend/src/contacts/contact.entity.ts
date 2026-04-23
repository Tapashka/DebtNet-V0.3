import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner_id: string;

  @Column()
  contact_user_id: string;

  @Column({ default: 'explicit' })
  source: string;

  @CreateDateColumn()
  created_at: Date;
}
