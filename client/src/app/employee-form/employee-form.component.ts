import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
  ],
  styles: `
    .employee-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
    }
    .mat-mdc-radio-button ~ .mat-mdc-radio-button {
      margin-left: 16px;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `,
  template: `
    <form
      class="employee-form"
      autocomplete="off"
      [formGroup]="employeeForm"
      (submit)="submitForm()"
    >
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput placeholder="Name" formControlName="name" required />
        @if (name.invalid) {
        <mat-error>Name must be at least 3 characters long.</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Position</mat-label>
        <input
          matInput
          placeholder="Position"
          formControlName="position"
          required
        />
        @if (position.invalid) {
        <mat-error>Position must be at least 5 characters long.</mat-error>
        }
      </mat-form-field>

      <mat-radio-group formControlName="level" aria-label="Select an option">
        <mat-radio-button name="level" value="junior" required 
          >Junior</mat-radio-button
        >
        <mat-radio-button name="level" value="mid"
          >Mid</mat-radio-button
        >
        <mat-radio-button name="level" value="senior"
          >Senior</mat-radio-button
        >
      </mat-radio-group>
      <br />
      <button
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="employeeForm.invalid"
      >
        Add
      </button>
    </form>
  `,
})
export class EmployeeFormComponent {
  initialState = input<Employee>();

  @Output()
  formValuesChanged = new EventEmitter<Employee>();

  @Output()
  formSubmitted = new EventEmitter<Employee>();

  employeeForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    position: ['', [Validators.required, Validators.minLength(5)]],
    level: ['junior', [Validators.required]],
  });

  constructor(private formBuilder: FormBuilder) {
    effect(() => {
      this.employeeForm.setValue({
        name: this.initialState()?.name || '',
        position: this.initialState()?.position || '',
        level: this.initialState()?.level || 'junior',
      });
    });
  }

  get name() {
    return this.employeeForm.get('name')!;
  }
  get position() {
    return this.employeeForm.get('position')!;
  }
  get level() {
    return this.employeeForm.get('level')!;
  }

  submitForm() {
    this.formSubmitted.emit(this.employeeForm.value as Employee);
  }
}
