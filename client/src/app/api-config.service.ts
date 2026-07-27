import { Service, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { resolveApiBaseUrl } from './api-url';

@Service()
export class ApiConfig {
  private readonly platformId = inject(PLATFORM_ID);

  // In the browser, derive the API URL from the current location so it works
  // across local dev and hosted/forwarded environments. During SSR/build,
  // fall back to localhost for deterministic behavior.
  readonly baseUrl = isPlatformBrowser(this.platformId)
    ? resolveApiBaseUrl(window.location)
    : 'http://localhost:5300';
}
