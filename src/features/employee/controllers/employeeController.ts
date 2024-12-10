import { Request, Response } from 'express';
import { employeeService } from '@service/db/employee.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { employeeSchema } from '@employee/schemes/employeeSchema';

export class Employee {

  @joiValidation(employeeSchema)
  async createEmployee(req: Request, res: Response) {
    try {
      const { error } = employeeSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });

      const { department_id, name, dob, phone, photo, email, salary, status } = req.body;

      const newEmployee = await employeeService.insertEmployee(
        department_id,
        name,
        dob,
        phone,
        photo,
        email,
        salary,
        status,
      );
      res.status(201).json(newEmployee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  async getEmployees(req: Request, res: Response) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const employees = await employeeService.fetchEmployees(
        Number(pageSize),
        (Number(page) - 1) * Number(pageSize)
      );
      const total = await employeeService.countEmployees();

      res.status(200).json({
        employees,
        total,
        totalPages: Math.ceil(total / Number(pageSize)),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  @joiValidation(employeeSchema)
  async updateEmployee(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { department_id, name, dob, phone, photo, email, salary, status } = req.body;

      const updatedEmployee = await employeeService.updateEmployeeById(
        Number(id),
        department_id,
        name,
        dob,
        phone,
        photo,
        email,
        salary,
        status
      );

      if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
      res.status(200).json(updatedEmployee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  async getEmployee(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const employeeData = await employeeService.getEmployeeById(Number(id));

      if (!employeeData) return res.status(404).json({ message: 'Employee not found' });
      res.status(200).json({ message: 'Employee found', employeeData });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }
  async deleteEmployee(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedEmployee = await employeeService.deleteEmployeeById(Number(id));

      if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }
}
