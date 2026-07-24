import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule],
    styles: [
        `
      main {
        display: flex;
        justify-content: center;
        padding: 2rem 4rem;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <mat-toolbar>
      <span>Employees Management System</span>
    </mat-toolbar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  title = 'client';
}
