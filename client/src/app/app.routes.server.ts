import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Employee data changes at runtime, so the list is rendered per-request.
  { path: '', renderMode: RenderMode.Server },
  { path: 'new', renderMode: RenderMode.Client },
  // Employee ids are unknown at build time, so this is rendered per-request.
  { path: 'edit/:id', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
