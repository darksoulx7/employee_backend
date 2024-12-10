import { Employee } from '@employee/controllers/employeeController';
import express, { Router } from 'express';

class EmployeeRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/employees', Employee.prototype.getEmployees);
    this.router.get('/employee/:id', Employee.prototype.getEmployee);
    this.router.post('/employees', Employee.prototype.createEmployee);
    this.router.put('/employees/:id', Employee.prototype.updateEmployee);
    this.router.delete('/employee/:id', Employee.prototype.deleteEmployee);

    return this.router;
  }
}

export const employeeRoutes: EmployeeRoutes = new EmployeeRoutes();
