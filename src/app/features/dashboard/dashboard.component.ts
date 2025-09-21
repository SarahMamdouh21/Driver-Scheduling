import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SchedulingService } from '../../core/services/scheduling.service';
import { Driver, Route } from '../../core/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  drivers: Driver[] = [];
  routes: Route[] = [];
  filteredDrivers: Driver[] = [];
  filteredRoutes: Route[] = [];
  
  searchDriverQuery = '';
  searchRouteQuery = '';
  filterDriverStatus = 'all';
  filterRouteStatus = 'all';
  
  private destroy$ = new Subject<void>();

  constructor(private schedulingService: SchedulingService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.schedulingService.drivers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(drivers => {
        this.drivers = drivers;
        this.applyDriverFilters();
      });

    this.schedulingService.routes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(routes => {
        this.routes = routes;
        this.applyRouteFilters();
      });
  }

  onDriverSearch(): void {
    this.applyDriverFilters();
  }

  onRouteSearch(): void {
    this.applyRouteFilters();
  }

  onDriverStatusFilter(): void {
    this.applyDriverFilters();
  }

  onRouteStatusFilter(): void {
    this.applyRouteFilters();
  }

  private applyDriverFilters(): void {
    let filtered = [...this.drivers];

    // Apply search filter
    if (this.searchDriverQuery.trim()) {
      const query = this.searchDriverQuery.toLowerCase();
      filtered = filtered.filter(driver =>
        driver.name.toLowerCase().includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        driver.phone.includes(query)
      );
    }

    // Apply status filter
    if (this.filterDriverStatus !== 'all') {
      filtered = filtered.filter(driver => {
        if (this.filterDriverStatus === 'available') {
          return driver.isAvailable;
        } else if (this.filterDriverStatus === 'busy') {
          return !driver.isAvailable;
        }
        return true;
      });
    }

    this.filteredDrivers = filtered;
  }

  private applyRouteFilters(): void {
    let filtered = [...this.routes];

    // Apply search filter
    if (this.searchRouteQuery.trim()) {
      const query = this.searchRouteQuery.toLowerCase();
      filtered = filtered.filter(route =>
        route.name.toLowerCase().includes(query) ||
        route.startLocation.toLowerCase().includes(query) ||
        route.endLocation.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.filterRouteStatus !== 'all') {
      filtered = filtered.filter(route => route.status === this.filterRouteStatus);
    }

    this.filteredRoutes = filtered;
  }

  assignRouteToDriver(routeId: string, driverId: string): void {
    this.schedulingService.assignDriverToRoute(driverId, routeId);
  }

  unassignRoute(routeId: string): void {
    const route = this.routes.find(r => r.id === routeId);
    if (route && route.assignedDriverId) {
      this.schedulingService.unassignDriverFromRoute(route.assignedDriverId, routeId);
    }
  }

  toggleDriverAvailability(driverId: string, isAvailable: boolean): void {
    this.schedulingService.updateDriver(driverId, { isAvailable });
  }

  onDriverAvailabilityChange(driverId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.toggleDriverAvailability(driverId, target.checked);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'unassigned': '#e74c3c',
      'assigned': '#f39c12',
      'in-progress': '#3498db',
      'completed': '#27ae60'
    };
    return colors[status] || '#95a5a6';
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'low': '#27ae60',
      'medium': '#f39c12',
      'high': '#e74c3c'
    };
    return colors[priority] || '#95a5a6';
  }

  getVehicleTypeIcon(vehicleType: string): string {
    const icons: { [key: string]: string } = {
      'sedan': '🚗',
      'suv': '🚙',
      'van': '🚐',
      'truck': '🚛'
    };
    return icons[vehicleType] || '🚗';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getAvailableDriversForRoute(route: Route): Driver[] {
    return this.drivers.filter(driver => 
      driver.isAvailable && 
      driver.vehicleType === route.vehicleType &&
      !driver.assignedRoutes.includes(route.id)
    );
  }

  getStats() {
    const totalDrivers = this.drivers.length;
    const availableDrivers = this.drivers.filter(d => d.isAvailable).length;
    const totalRoutes = this.routes.length;
    const unassignedRoutes = this.routes.filter(r => r.status === 'unassigned').length;
    const assignedRoutes = this.routes.filter(r => r.status === 'assigned' || r.status === 'in-progress').length;

    return {
      totalDrivers,
      availableDrivers,
      totalRoutes,
      unassignedRoutes,
      assignedRoutes
    };
  }

  getRouteName(routeId: string): string {
    const route = this.routes.find(r => r.id === routeId);
    return route?.name || 'Unknown Route';
  }
}
