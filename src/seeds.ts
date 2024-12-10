import { Pool, Client } from 'pg';
import { faker } from '@faker-js/faker';

const dbConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
};
const dbName = 'hp_ems';

const pool = new Pool({
  ...dbConfig,
  database: dbName,
});

const NUM_EMPLOYEES = 500;

const createTables = async () => {
  const departmentTableQuery = `
    CREATE TABLE IF NOT EXISTS departments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status BOOLEAN DEFAULT TRUE,
      created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const employeeTableQuery = `
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      dob DATE NOT NULL,
      phone VARCHAR(15),
      photo TEXT,
      email VARCHAR(255) UNIQUE NOT NULL,
      salary NUMERIC(10, 2) NOT NULL CHECK (salary >= 0),
      status BOOLEAN DEFAULT TRUE,
      created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(departmentTableQuery);
    console.log('Departments table created successfully.');

    await pool.query(employeeTableQuery);
    console.log('Employees table created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};


const insertDepartments = async () => {
  const departmentNames = ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'];
  const queries = departmentNames.map((name) => {
    return pool.query('INSERT INTO departments (name, status) VALUES ($1, $2)', [
      name,
      true,
    ]);
  });
  await Promise.all(queries);
  console.log('Departments added.');
};

const generatePhoneNumber = () => {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
};

const insertEmployees = async () => {
  const departmentIds = await pool.query('SELECT id FROM departments');
  const departmentIdArray = departmentIds.rows.map((row) => row.id);

  const queries = Array.from({ length: NUM_EMPLOYEES }).map(() => {
    const randomDeptId = faker.helpers.arrayElement(departmentIdArray);
    const dob = faker.date.birthdate({ min: 18, max: 50, mode: 'age' });
    const salary = faker.datatype.number({ min: 30000, max: 150000 });

    return pool.query(
      `INSERT INTO employees (department_id, name, dob, phone, photo, email, salary, status) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        randomDeptId,
        faker.name.fullName(),
        dob,
        generatePhoneNumber(),
        `https://picsum.photos/seed/${faker.datatype.uuid()}/200/300`,
        faker.internet.email(),
        salary,
        faker.datatype.boolean(),
      ]
    );
  });

  await Promise.all(queries);
  console.log('Employees added.');
};

const createDatabaseIfNotExists = async () => {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (error) {
    console.error('Error checking or creating database:', error);
  } finally {
    await client.end();
  }
};

const insertDummyData = async () => {
  try {
    await createDatabaseIfNotExists();
    await createTables();
    await insertDepartments();
    await insertEmployees();
    console.log('Added dummy values into db.');
  } catch (error) {
    console.error('Error in insertDummyData:', error);
  } finally {
    await pool.end();
  }
};

insertDummyData();
