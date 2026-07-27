import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeForm } from '../employee-form/employee-form';
import { Employee } from '../employee';
import { EmployeeService } from '../employee';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-add-employee',
    imports: [EmployeeForm, MatCardModule],
    template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add a New Employee</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-employee-form
          (formSubmitted)="addEmployee($event)"
        ></app-employee-form>
      </mat-card-content>
    </mat-card>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: ``
})
export class AddEmployee {
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);

  addEmployee(employee: Employee) {
    this.employeeService.createEmployee(employee).subscribe({
      next: () => {
        this.employeeService.employeesResource.reload();
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to create employee');
        console.error(error);
      },
    });
  }
}
