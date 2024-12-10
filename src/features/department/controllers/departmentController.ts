import { Request, Response } from 'express';
import { departmentService } from '@service/db/department.service';

export class Department {
  async getAllDepartments(req: Request, res: Response) {
    try {
      const departments = await departmentService.fetchAllDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching departments', error });
    }
  }
}
