import { Service, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Employee } from './employee';
import { ApiConfigService } from './api-config.service';

@Service()
export class EmployeeService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = inject(ApiConfigService).baseUrl;

  readonly employeesResource = httpResource<Employee[]>(() => `${this.url}/employees`, {
    defaultValue: [],
  });

  getEmployee(id: string) {
    return this.httpClient.get<Employee>(`${this.url}/employees/${id}`);
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
