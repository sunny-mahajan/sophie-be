import User from "@models/User";
import { Permission, Role } from "@models";
import { Op, Transaction } from "sequelize";
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
  public async getTeamList(filter: {
    status?: string;
    name?: string;
    excludeUserId?: number;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};
    if (filter.excludeUserId) {
      where.id = { [Op.ne]: filter.excludeUserId };
    }
    if (filter.status) where.status = filter.status;
    if (filter.name) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${filter.name}%` } },
        { lastName: { [Op.iLike]: `%${filter.name}%` } },
      ];
    }

    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const offset = (page - 1) * limit;

    return User.findAndCountAll({
      where,
      include: [
        {
          model: Role,
          through: { attributes: [] },
          as: "roles",
          attributes: ["name"],
        },
      ],
      attributes: ["id", "email", "firstName", "lastName", "status"],
      limit,
      offset,
    });
  }
}

export default new UserRepository();
