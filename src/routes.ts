
import { Application } from 'express';
import { healthRoutes } from '@root/features/department/routes/healthRoutes';
import { employeeRoutes } from '@employee/routes/employeeRoutes';
import { departmentRoutes } from '@department/routes/departmentRoutes';
import { dashboardRoutes } from '@dashboard/routes/dashboardRoutes';

const BASE_PATH = '/dev';
export default (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, employeeRoutes.routes());
    app.use(BASE_PATH, departmentRoutes.routes());
    app.use(BASE_PATH, dashboardRoutes.routes());
    app.use(BASE_PATH, healthRoutes.health());
  };
  routes();
};
