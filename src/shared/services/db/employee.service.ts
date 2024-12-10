import pool from '../dbclient';

class EmployeeService {
  async insertEmployee(
    department_id: number,
    name: string,
    dob: string,
    phone: string,
    photo: string | null,
    email: string,
    salary: number,
    status: boolean | null
  ) {
    const query = `
      INSERT INTO employees (department_id, name, dob, phone, photo, email, salary, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
    `;
    const result = await pool.query(query, [department_id, name, dob, phone, photo, email, salary, status]);
    return result.rows[0];
  }

  async fetchEmployees(limit: number, offset: number) {
    const query = `
      SELECT * FROM employees
      LIMIT $1 OFFSET $2;
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  async countEmployees() {
    const query = 'SELECT COUNT(*) FROM employees;';
    const result = await pool.query(query);
    return Number(result.rows[0].count);
  }

  async updateEmployeeById(
    id: number,
    department_id: number,
    name: string,
    dob: string,
    phone: string,
    photo: string | null,
    email: string,
    salary: number,
    status: boolean
  ) {
    const query = `
      UPDATE employees SET
        department_id = $1,
        name = $2,
        dob = $3,
        phone = $4,
        photo = $5,
        email = $6,
        salary = $7,
        status = $8,
        modified = CURRENT_TIMESTAMP
      WHERE id = $9 RETURNING *;
    `;
    const result = await pool.query(query, [department_id, name, dob, phone, photo, email, salary, status, id]);
    return result.rows[0];
  }

  async deleteEmployeeById(id: number) {
    const query = 'DELETE FROM employees WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async getEmployeeById(id: number) {
    const query = 'SELECT * FROM employees WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export const employeeService: EmployeeService = new EmployeeService();
