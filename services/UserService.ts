import { User } from "@models";
import UserRepository from "@repositories/UserRepository";
import PermissionService from "@services/PermissionService";

type UserWithRolesAndPermissions = {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  roles: string[];
  permissions: string[];
};

class UserService {
  async getUserWithRolesAndPermissions(
    email: string
  ): Promise<UserWithRolesAndPermissions | null> {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) return null;

    const roles = user.roles?.map((role) => role.name) || [];

    const rolePermissions =
      user.roles?.flatMap((role) => role.permissions || []) || [];

    const permissions = await PermissionService.getExpandedPermissionNames(
      rolePermissions
    );

    return {
      id: user.id,
      email: user.email,
      password_hash: user.password_hash,
      first_name: user.first_name,
      last_name: user.last_name,
      roles,
      permissions: permissions,
    };
  }
}

export default new UserService();
