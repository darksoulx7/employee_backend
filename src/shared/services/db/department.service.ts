import pool from '../dbclient';

class DepartmentService {
  async fetchAllDepartments() {
    const query = 'SELECT * FROM departments;';
    const result = await pool.query(query);
    return result.rows;
  }
}

export const departmentService: DepartmentService = new DepartmentService();

