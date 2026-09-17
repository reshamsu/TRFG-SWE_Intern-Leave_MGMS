import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./userEntity.ts";

export enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}


@Entity("leave_requests")
export class LeaveEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "employee_id" })
  user!: User;

  @Column({ type: "date" })
  start_date!: Date;

  @Column({ type: "date" })
  end_date!: Date;

  @Column({ type: "integer" })
  total_days: number = 0;

  @Column({ type: "varchar" })
  reason: string = "";

  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING,
  })
  status: Status = Status.PENDING;

  @Column({ type: "integer", nullable: true })
  approved_by?: number;

  @Column({ type: "timestamp", nullable: true })
  approved_at?: Date;

  @Column({ type: "text", nullable: true })
  rejection_reason?: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @CreateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
