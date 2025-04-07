import { Permission } from "@models";
import PermissionRepository from "@repositories/PermissionRepository";

class PermissionService {
  async getAllPermissions() {
    return await PermissionRepository.getAll();
  }

  async expandPermissions(permissions: Permission[]): Promise<string[]> {
    const basePermissions = permissions.map((p) => p.name);
    const parentIds = permissions.map((p) => p.id);

    const subPermissions = await PermissionRepository.getSubPermissions(
      parentIds
    );
    const subPermissionNames = subPermissions.map((p) => p.name);

    return [...new Set([...basePermissions, ...subPermissionNames])];
  }
  async getSubPermissions(parentIds: number[]) {
    return await PermissionRepository.getSubPermissions(parentIds);
  }

  async getExpandedPermissionNames(
    permissions: Permission[]
  ): Promise<string[]> {
    const baseNames = permissions.map((p) => p.name);
    const parentIds = permissions.map((p) => p.id);

    const subPermissions = await this.getSubPermissions(parentIds);
    const subNames = subPermissions.map((p) => p.name);

    return [...new Set([...baseNames, ...subNames])];
  }
}

export default new PermissionService();
