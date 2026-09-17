import { Repository } from "typeorm";
import { AppDataSource } from "../data-source.ts";
import { UserEntity } from "../entities/userEntity.ts";
import * as bcrypt from "bcrypt";

const userRepository: Repository<UserEntity> = AppDataSource.getRepository(UserEntity);

// --- USER FUNCTIONAL EXPORTS ---

export const fetchAllUsers = async (): Promise<UserEntity[]> => {
  return await userRepository.find({
    order: { created_at: "ASC" },
    withDeleted: true,
  });
};

export const createUser = async (userData: Partial<UserEntity>): Promise<UserEntity> => {
  const existingUser = await userRepository.findOne({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password!, saltRounds);

  const newUser = userRepository.create({
    ...userData,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
};

export const getMyUser = async (
  id: number,
): Promise<UserEntity[]> => {
  return await userRepository.find({
    where: {
      id
    },
    order: { created_at: "ASC" },
  });
};


export const updateUser = async (
  id: number,
  userData: Partial<UserEntity>,
): Promise<Omit<UserEntity, 'password'>> => {
  const user = await userRepository.findOne({ where: { id } });

  if (!user) {
    const error = new Error(`User with ID ${id} not found`);
    (error as any).statusCode = 404;
    throw error;
  }

  if (userData.password) {
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);
  } else if (userData.password) {
    delete userData.password;
  }

  const updatedUser = userRepository.merge(user, userData);
  const savedUser = await userRepository.save(updatedUser);

  const { password, ...userWithoutPassword } = savedUser;

  return userWithoutPassword;
};

export const softDeleteUser = async (id: number): Promise<UserEntity> => {
  const userRequest = await userRepository.findOne({ where: { id } });

  if (!userRequest) {
    const error = new Error(`User request with ID ${id} not found`);
    (error as any).statusCode = 404;
    throw error;
  }

  return await userRepository.softRemove(userRequest);
};
