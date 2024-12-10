import { Dashboard } from '@dashboard/controllers/dashboardController';
import express, { Router } from 'express';

class DashboardRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/dashboard/department-wise-highest-salary', Dashboard.prototype.getDepartmentWiseHighestSalary);
    this.router.get('/dashboard/salary-range-count', Dashboard.prototype.getSalaryRangeCount);
    this.router.get('/dashboard/youngest-by-department', Dashboard.prototype.getYoungestEmployeeByDepartment);

    return this.router;
  }
}

export const dashboardRoutes: DashboardRoutes = new DashboardRoutes();
