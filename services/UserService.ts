import { User } from "@models";
import UserRepository from "@repositories/UserRepository";
import PermissionService from "@services/PermissionService";

type UserWithRolesAndPermissions = {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
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
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      permissions: permissions,
    };
  }
}

export default new UserService();
