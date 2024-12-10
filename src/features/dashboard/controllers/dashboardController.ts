import { dashBoardService } from '@service/db/dashboard.service';
import { Request, Response } from 'express';

export class Dashboard {
  async getDepartmentWiseHighestSalary(req: Request, res: Response) {
    try {
      const stats = await dashBoardService.fetchHighestSalaryByDepartment();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching statistics', error });
    }
  }

  async getSalaryRangeCount(req: Request, res: Response) {
    try {
      const stats = await dashBoardService.fetchSalaryRangeWiseCount();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching salary range count', error });
    }
  }

  async getYoungestEmployeeByDepartment(req: Request, res: Response) {
    try {
      const stats = await dashBoardService.fetchYoungestEmployeeByDepartment();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching youngest employee statistics', error });
    }
  }
}
