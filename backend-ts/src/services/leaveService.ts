import { AppDataSource } from "../data-source.ts";
import { LeaveEntity, Status } from "../entities/leaveEntity.ts";
import { User } from "../entities/userEntity.ts";

const leaveRepository = AppDataSource.getRepository(LeaveEntity);
const userRepository = AppDataSource.getRepository(User);

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
  request.start_date = new Date(startDate);
  request.end_date = new Date(endDate);
  request.reason = reason;
  request.total_days = totalDays;

  return await leaveRepository.save(request);
};

export const getLeaveHistory = async (
  employeeId: number,
): Promise<LeaveEntity[]> => {
  return await leaveRepository.find({
    where: {
      user: {
        id: Number(employeeId),
      },
    },
    order: { created_at: "DESC" },
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

  if (leaveRequest.status === Status.REJECTED) {
    throw new Error(
      "Cannot cancel a leave request that has already been rejected",
    );
  }
  if (leaveRequest.status === Status.APPROVED) {
    throw new Error(
      "Cannot cancel a leave request that has already been approved",
    );
  }

  leaveRequest.status = Status.CANCELLED;

  return await leaveRepository.save(leaveRequest);
};

// export const changeRequest = async ({
//   id,
//   employeeId,
// }: {
//   id: number;
//   employeeId: number;
// }): Promise<LeaveEntity> => {

//   const leaveRequest = await leaveRepository.findOne({
//     where: {
//       id,
//       user: { id: employeeId },
//     },
//   });

//   if (!leaveRequest) {
//     throw new Error("Leave request not found or unauthorized");
//   }

//   if (leaveRequest.status === Status.REJECTED) {
//     throw new Error(
//       "Cannot change a leave request that has already been rejected",
//     );
//   }
//   if (leaveRequest.status === Status.APPROVED) {
//     throw new Error(
//       "Cannot cancel a leave request that has already been approved",
//     );
//   }

//   leaveRequest.status = Status.CHANGED;

//   return await leaveRepository.save(leaveRequest);
// };
