import User from "@models/User";
import { Permission, Role } from "@models";
import { Transaction } from "sequelize";
import { IUserCreateAttributes } from "types/user";

class UserRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({
      attributes: ["id", "passwordHash", "email", "firstName", "lastName"],
      where: { email },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name"],
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["id", "name", "parent_id"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
    return user;
  }

  async updateRefreshToken(
    userId: number,
    token: string,
    options?: { transaction?: Transaction }
  ) {
    await User.update(
      { refreshToken: token },
      {
        where: { id: userId },
        ...options,
      }
    );
  }
  async create(data: IUserCreateAttributes, transaction?: Transaction) {
    return await User.create(data, { transaction });
  }
}

export default new UserRepository();
