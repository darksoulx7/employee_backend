import { Department } from '@department/controllers/departmentController';
import express, { Router } from 'express';

class DepartmentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/departments/get-all-departments',  Department.prototype.getAllDepartments);
    return this.router;
  }
}

export const departmentRoutes: DepartmentRoutes = new DepartmentRoutes();
