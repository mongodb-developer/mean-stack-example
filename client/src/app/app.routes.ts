import { inject } from '@angular/core';
import { ResolveFn, Router, RedirectCommand, Routes } from '@angular/router';
import { catchError, of } from 'rxjs';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

const employeeResolver: ResolveFn<Employee | RedirectCommand> = (route) => {
  const router = inject(Router);
  return inject(EmployeeService).getEmployee(route.paramMap.get('id')!).pipe(
    catchError(() => of(new RedirectCommand(router.parseUrl('/'))))
  );
};

export const routes: Routes = [
  { path: '', component: EmployeesListComponent, title: 'Employees List' },
  { path: 'new', component: AddEmployeeComponent },
  { path: 'edit/:id', component: EditEmployeeComponent, resolve: { employee: employeeResolver } },
];
