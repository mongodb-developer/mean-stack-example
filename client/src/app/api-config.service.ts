import { Service, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Service()
export class ApiConfigService {
  // In browser (including Codespaces), target current host on API port.
  // During SSR/build contexts, fall back to localhost for deterministic behavior.
  readonly baseUrl = isPlatformBrowser(inject(PLATFORM_ID))
    ? `${window.location.protocol}//${window.location.hostname}:5300`
    : 'http://localhost:5300';
}
