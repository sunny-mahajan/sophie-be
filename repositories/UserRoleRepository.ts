import { UserRole } from "@models";
import { Transaction } from "sequelize";

class UserRoleRepository {
  public async assignRolesToUser(
    userId: number,
    roleIds: number[],
    transaction?: Transaction
  ) {
    const userRoles = roleIds.map((roleId) => ({
      user_id: userId,
      role_id: roleId,
    }));
    return await UserRole.bulkCreate(userRoles, { transaction });
  }
}

export default new UserRoleRepository();
