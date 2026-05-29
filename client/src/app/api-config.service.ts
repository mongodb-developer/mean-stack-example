import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  readonly baseUrl: string;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    // In browser (including Codespaces), target current host on API port.
    // During SSR/build contexts, fall back to localhost for deterministic behavior.
    if (isPlatformBrowser(platformId)) {
      const { protocol, hostname } = window.location;
      this.baseUrl = `${protocol}//${hostname}:5300`;
      return;
    }

    this.baseUrl = 'http://localhost:5300';
  }
}
