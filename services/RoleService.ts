import RoleRepository from "@repositories/RoleRepository";

class RoleService {
  async getAllRoles() {
    return await RoleRepository.getAllRoles();
  }
}

export default new RoleService();
