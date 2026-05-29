import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly url: string;
  employees$ = signal<Employee[]>([]);
  employee$ = signal<Employee>({} as Employee);
  
  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    // In browser (including Codespaces), target the current host on API port.
    // During SSR/build contexts, fall back to localhost for deterministic behavior.
    if (isPlatformBrowser(platformId)) {
      const { protocol, hostname } = window.location;
      this.url = `${protocol}//${hostname}:5200`;
      return;
    }

    this.url = 'http://localhost:5200';
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
