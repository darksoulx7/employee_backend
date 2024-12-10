import pool from '../dbclient';

class DashBoardService {
  async fetchHighestSalaryByDepartment() {
    const query = `
      SELECT d.name AS department_name, MAX(e.salary) AS highest_salary
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      GROUP BY d.name;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async fetchSalaryRangeWiseCount() {
    const query = `
      SELECT
        CASE
          WHEN salary <= 50000 THEN '0-50000'
          WHEN salary BETWEEN 50001 AND 100000 THEN '50001-100000'
          ELSE '100001+'
        END AS salary_range,
        COUNT(*) AS employee_count
      FROM employees
      GROUP BY salary_range;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async fetchYoungestEmployeeByDepartment() {
    const query = `
      SELECT d.name AS department_name, e.name, EXTRACT(YEAR FROM AGE(e.dob)) AS age
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      WHERE e.dob = (
        SELECT MIN(dob) FROM employees WHERE department_id = e.department_id
      );
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export const dashBoardService: DashBoardService = new DashBoardService();
