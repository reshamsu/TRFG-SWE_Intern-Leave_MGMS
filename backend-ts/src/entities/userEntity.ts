import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";

export const Role = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

export type StatusType = (typeof UserStatus)[keyof typeof UserStatus];

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: "varchar" })
  name: string = "";

  @Column({ type: "varchar" })
  email: string = "";

  @Column({ type: "varchar" })
  password: string = "";

  @Column({
    type: "enum",
    enum: Role,
    default: Role.EMPLOYEE,
  })
  role: RoleType = Role.EMPLOYEE;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: StatusType = UserStatus.ACTIVE;

  @CreateDateColumn()
  created_at!: Date;

  @CreateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
