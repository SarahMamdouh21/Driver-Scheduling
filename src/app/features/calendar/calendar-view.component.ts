import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SchedulingService } from '../../core/services/scheduling.service';
import { Driver, Route } from '../../core/interfaces';

interface CalendarDay {
  date: Date;
  routes: Route[];
  drivers: Driver[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  routes: Route[] = [];
  drivers: Driver[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(private schedulingService: SchedulingService) {}

  ngOnInit(): void {
    this.loadData();
    this.generateCalendar();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.schedulingService.routes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(routes => {
        this.routes = routes;
        this.generateCalendar();
      });

    this.schedulingService.drivers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(drivers => {
        this.drivers = drivers;
        this.generateCalendar();
      });
  }

  private generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    this.calendarDays = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayRoutes = this.routes.filter(route => 
        this.isSameDay(new Date(route.scheduledDate), current)
      );
      
      const dayDrivers = this.drivers.filter(driver => 
        driver.isAvailable
      );
      
      this.calendarDays.push({
        date: new Date(current),
        routes: dayRoutes,
        drivers: dayDrivers,
        isCurrentMonth: current.getMonth() === month,
        isToday: this.isSameDay(current, new Date())
      });
      
      current.setDate(current.getDate() + 1);
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateCalendar();
  }

  getMonthName(): string {
    return this.currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  getDayName(day: CalendarDay): string {
    return day.date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  getDayNumber(day: CalendarDay): number {
    return day.date.getDate();
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

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTotalRoutes(): number {
    return this.routes.length;
  }

  getAvailableDrivers(): number {
    return this.drivers.filter(driver => driver.isAvailable).length;
  }

  getAvailableDriversForRoute(route: Route): Driver[] {
    return this.drivers.filter(driver => 
      driver.isAvailable && 
      driver.vehicleType === route.vehicleType &&
      !driver.assignedRoutes.includes(route.id)
    );
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
}
