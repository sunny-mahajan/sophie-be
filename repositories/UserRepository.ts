import User from "@models/User";
import { Permission, Role } from "@models";
import { Transaction } from "sequelize";

class UserRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({
      attributes: ["id", "password_hash", "email", "first_name", "last_name"],
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
      { refresh_token: token },
      {
        where: { id: userId },
        ...options,
      }
    );
  }
}

export default new UserRepository();
