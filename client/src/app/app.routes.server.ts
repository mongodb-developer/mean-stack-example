import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Employee data changes at runtime, so the list is rendered per-request.
  { path: '', renderMode: RenderMode.Server },
  // Static form with no dynamic data.
  { path: 'new', renderMode: RenderMode.Prerender },
  // Employee ids are unknown at build time, so this is rendered per-request.
  { path: 'edit/:id', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
