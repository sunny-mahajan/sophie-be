import UserRepository from "@repositories/UserRepository";

class TeamService {
  public async getTeamList(filter: {
    status?: string;
    name?: string;
    page?: number;
    limit?: number;
  }) {
    const team = await UserRepository.getTeamList(filter);
    return team.rows.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      role: user.roles?.[0]?.name || null,
    }));
  }
}

export default new TeamService();
