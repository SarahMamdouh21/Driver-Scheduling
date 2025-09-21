import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'drivers', 
    loadComponent: () => import('./features/drivers/driver-form.component').then(m => m.DriverFormComponent)
  },
  { 
    path: 'routes', 
    loadComponent: () => import('./features/routes/route-form.component').then(m => m.RouteFormComponent)
  },
  { 
    path: 'calendar', 
    loadComponent: () => import('./features/calendar/calendar-view.component').then(m => m.CalendarViewComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
