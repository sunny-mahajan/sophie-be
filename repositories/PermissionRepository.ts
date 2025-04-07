import { Permission } from "@models";

class PermissionRepository {
  async getAll(): Promise<Permission[]> {
    return await Permission.findAll();
  }

  async getByName(name: string): Promise<Permission | null> {
    return await Permission.findOne({ where: { name } });
  }

  async getSubPermissions(parentIds: number[]): Promise<Permission[]> {
    return await Permission.findAll({
      where: { parent_id: parentIds },
    });
  }
}

export default new PermissionRepository();
