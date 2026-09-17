import { Repository } from "typeorm";
import { AppDataSource } from "../data-source.ts";
import { User } from "../entities/userEntity.ts";
import * as bcrypt from "bcrypt";
import { LeaveEntity, Status } from "../entities/leaveEntity.ts";

export class AdminService {
  private leaveRepository: Repository<LeaveEntity> =
    AppDataSource.getRepository(LeaveEntity);
  private userRepository: Repository<User> = AppDataSource.getRepository(User);

  async fetchAllLeaves() {
    return await this.leaveRepository.find({
      relations: {
        user: true,
      },
      order: { created_at: "DESC" },
    });
  }

  // Register Service
  async registerUser(userData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password!, saltRounds);

    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  async updateLeaveStatus(
    id: number,
    adminId: number,
    status: Status,
    rejectionReason?: string,
  ) {
    const leaveRequest = await this.leaveRepository.findOne({ where: { id } });

    if (!leaveRequest) {
      const error = new Error(`Leave request with ID ${id} not found`);
      (error as any).statusCode = 404;
      throw error;
    }

    leaveRequest.status = status;
    leaveRequest.approved_by = adminId;
    leaveRequest.approved_at = new Date();

    if (status == Status.REJECTED) {
      leaveRequest.rejection_reason = rejectionReason;
    } else {
      leaveRequest.rejection_reason = null as any;
    }

    return await this.leaveRepository.save(leaveRequest);
  }

  async fetchAllUsers() {
    return await this.userRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async updateUserStatus(id: number, adminId: number, status: Status) {
    const userRequest = await this.userRepository.findOne({ where: { id } });

    if (!userRequest) {
      const error = new Error(`User request with ID ${id} not found`);
      (error as any).statusCode = 404;
      throw error;
    }

    userRequest.status = status as any;

    return await this.userRepository.save(userRequest);
  }
}
