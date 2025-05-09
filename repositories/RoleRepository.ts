import { Op } from "sequelize";
import { Role } from "@models";

class RoleRepository {
  public async getAllRoles() {
    return await Role.findAll({
      order: [["name", "ASC"]],
    });
  }
  public async getRolesByNames(roleNames: string[]) {
    return await Role.findAll({
      where: {
        name: {
          [Op.in]: roleNames,
        },
      },
    });
  }
}

export default new RoleRepository();
