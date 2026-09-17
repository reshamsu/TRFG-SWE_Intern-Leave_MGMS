import { AppDataSource } from "../data-source.ts";
import { LeaveEntity, LeaveStatus } from "../entities/leaveEntity.ts";
import { UserEntity } from "../entities/userEntity.ts";

const leaveRepository = AppDataSource.getRepository(LeaveEntity);
const userRepository = AppDataSource.getRepository(UserEntity);

// --- EMPLOYEE ACTIONS ---

export const createLeave = async ({
  employeeId,
  startDate,
  endDate,
  reason,
}: {
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
}): Promise<LeaveEntity> => {
  const userRef = await userRepository.findOneBy({ id: employeeId });
  if (!userRef) {
    throw new Error("User not found");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDiff = end.getTime() - start.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  const totalDays = dayDiff > 0 ? dayDiff : 1;

  const request = new LeaveEntity();
  request.user = userRef;
  request.start_date = start;
  request.end_date = end;
  request.reason = reason;
  request.total_days = totalDays;
  request.status = LeaveStatus.PENDING; // Explicitly set starting state

  return await leaveRepository.save(request);
};

export const getLeaveHistory = async (
  employeeId: number,
): Promise<LeaveEntity[]> => {
  return await leaveRepository.find({
    where: {
      user: {
        id: employeeId,
      },
    },
    order: { created_at: "ASC" },
  });
};

export const cancelRequest = async ({
  id,
  employeeId,
}: {
  id: number;
  employeeId: number;
}): Promise<LeaveEntity> => {
  const leaveRequest = await leaveRepository.findOne({
    where: {
      id,
      user: { id: employeeId },
    },
  });

  if (!leaveRequest) {
    throw new Error("Leave request not found or unauthorized");
  }

  if (leaveRequest.status === LeaveStatus.REJECTED) {
    throw new Error(
      "Cannot cancel a leave request that has already been rejected",
    );
  }
  if (leaveRequest.status === LeaveStatus.APPROVED) {
    throw new Error(
      "Cannot cancel a leave request that has already been approved",
    );
  }

  leaveRequest.status = LeaveStatus.CANCELLED;

  return await leaveRepository.save(leaveRequest);
};

// --- ADMIN ACTIONS ---

export const fetchAllLeaves = async (): Promise<LeaveEntity[]> => {
  return await leaveRepository.find({
    relations: {
      user: true,
    },
    order: { created_at: "ASC" },
  });
};

export const updateLeaveStatus = async ({
  id,
  adminId,
  status,
  rejectionReason,
}: {
  id: number;
  adminId: number;
  status: LeaveStatus;
  rejectionReason?: string;
}): Promise<LeaveEntity> => {
  const leaveRequest = await leaveRepository.findOne({ where: { id } });

  if (!leaveRequest) {
    const error = new Error(`Leave request with ID ${id} not found`);
    (error as any).statusCode = 404;
    throw error;
  }

  leaveRequest.status = status;
  leaveRequest.approved_by = adminId;
  leaveRequest.approved_at = new Date();

  if (status === LeaveStatus.REJECTED && rejectionReason) {
    leaveRequest.rejection_reason = rejectionReason;
  } else {
    leaveRequest.rejection_reason = null as any;
  }

  return await leaveRepository.save(leaveRequest);
};
