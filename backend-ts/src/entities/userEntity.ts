import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

// 1. Define your enums outside the class
export const Role = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const Status = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type StatusType = (typeof Status)[keyof typeof Status];

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: "varchar" })
  name: string = "";

  @Column({ type: "varchar" })
  email: string = "";

  // Note: Usually passwords are strings (hashed hashes),
  // but keeping it as number if that's your design choice.
  @Column({ type: "varchar" })
  password: string = "";

  // 2. Pass the enum to the @Column decorator options
  @Column({
    type: "enum",
    enum: Role,
    default: Role.EMPLOYEE, // optional default value
  })
  role: RoleType = Role.EMPLOYEE;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING,
  })
  status: StatusType = Status.PENDING;

  @CreateDateColumn()
  createdAt!: Date;
}
