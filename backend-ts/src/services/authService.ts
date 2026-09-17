import { AppDataSource } from "../data-source.ts";
import { UserEntity } from "../entities/userEntity.ts";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  private userRepository = AppDataSource.getRepository(UserEntity);

  // Login Service
  async loginUser(
    credentials: Pick<UserEntity, "email" | "password">,
  ): Promise<{ token: string; user: Omit<UserEntity, "password"> }> {
    const user = await this.userRepository.findOne({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPassowrdValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!isPassowrdValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }, // session terminated after 24 hours
    );

    const { password, ...safeUser } = user;

    return {
      token,
      user: safeUser,
    };
  }
}
