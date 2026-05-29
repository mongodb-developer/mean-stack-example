import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly url: string;
  employees$ = signal<Employee[]>([]);
  employee$ = signal<Employee>({} as Employee);
  
  constructor(
    private httpClient: HttpClient,
    private apiConfig: ApiConfigService,
  ) {
    this.url = this.apiConfig.baseUrl;
  }

  private refreshEmployees() {
    this.httpClient.get<Employee[]>(`${this.url}/employees`)
      .subscribe(employees => {
        this.employees$.set(employees);
      });
  }

  getEmployees() {
    this.refreshEmployees();
    return this.employees$();
  }

  getEmployee(id: string) {
    this.httpClient.get<Employee>(`${this.url}/employees/${id}`).subscribe(employee => {
      this.employee$.set(employee);
      return this.employee$();
    });
  }

  createEmployee(employee: Employee) {
    return this.httpClient.post(`${this.url}/employees`, employee, { responseType: 'text' });
  }

  updateEmployee(id: string, employee: Employee) {
    return this.httpClient.put(`${this.url}/employees/${id}`, employee, { responseType: 'text' });
  }

  deleteEmployee(id: string) {
    return this.httpClient.delete(`${this.url}/employees/${id}`, { responseType: 'text' });
  }
}
