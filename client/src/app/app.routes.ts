import { inject } from '@angular/core';
import { ResolveFn, Router, RedirectCommand, Routes } from '@angular/router';
import { catchError, of } from 'rxjs';
import { EmployeesList } from './employees-list/employees-list';
import { AddEmployee } from './add-employee/add-employee';
import { EditEmployee } from './edit-employee/edit-employee';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

const employeeResolver: ResolveFn<Employee | RedirectCommand> = (route) => {
  const router = inject(Router);
  return inject(EmployeeService).getEmployee(route.paramMap.get('id')!).pipe(
    catchError(() => of(new RedirectCommand(router.parseUrl('/'))))
  );
};

export const routes: Routes = [
  { path: '', component: EmployeesList, title: 'Employees List' },
  { path: 'new', component: AddEmployee },
  { path: 'edit/:id', component: EditEmployee, resolve: { employee: employeeResolver } },
];
