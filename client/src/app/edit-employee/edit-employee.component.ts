import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { Router } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-edit-employee',
    imports: [EmployeeFormComponent, MatCardModule],
    template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Edit an Employee</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-employee-form
          [initialState]="employee()"
          (formSubmitted)="editEmployee($event)"
        ></app-employee-form>
      </mat-card-content>
    </mat-card>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: ``
})
export class EditEmployeeComponent {
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);

  employee = input.required<Employee>();

  editEmployee(employee: Employee) {
    this.employeeService
      .updateEmployee(this.employee()._id || '', employee)
      .subscribe({
        next: () => {
          this.employeeService.employeesResource.reload();
          this.router.navigate(['/']);
        },
        error: (error) => {
          alert('Failed to update employee');
          console.error(error);
        },
      });
  }
}
