import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TableState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  data: string; // JSON stringified array

  @Column('text')
  colWidths: string; // JSON stringified array

  @Column('text')
  rowHeights: string; // JSON stringified array
} 