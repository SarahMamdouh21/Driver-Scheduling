import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Driver, CreateDriverRequest, Route, CreateRouteRequest } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  private readonly driversSubject = new BehaviorSubject<Driver[]>([]);
  private readonly routesSubject = new BehaviorSubject<Route[]>([]);
  
  public readonly drivers$ = this.driversSubject.asObservable();
  public readonly routes$ = this.routesSubject.asObservable();
  
  // Signals for modern Angular approach
  private readonly driversSignal = signal<Driver[]>([]);
  private readonly routesSignal = signal<Route[]>([]);
  
  public readonly drivers = computed(() => this.driversSignal());
  public readonly routes = computed(() => this.routesSignal());
  public readonly availableDrivers = computed(() => 
    this.driversSignal().filter(driver => driver.isAvailable)
  );
  public readonly unassignedRoutes = computed(() => 
    this.routesSignal().filter(route => route.status === 'unassigned')
  );

  constructor() {
    this.initializeMockData();
  }

  // Driver methods
  addDriver(driverData: CreateDriverRequest): Driver {
    const newDriver: Driver = {
      id: this.generateId(),
      ...driverData,
      isAvailable: true,
      assignedRoutes: [],
      rating: 5,
      joinDate: new Date()
    };
    
    const currentDrivers = this.driversSubject.value;
    const updatedDrivers = [...currentDrivers, newDriver];
    
    this.driversSubject.next(updatedDrivers);
    this.driversSignal.set(updatedDrivers);
    
    return newDriver;
  }

  updateDriver(id: string, updates: Partial<Driver>): Driver | null {
    const currentDrivers = this.driversSubject.value;
    const driverIndex = currentDrivers.findIndex(driver => driver.id === id);
    
    if (driverIndex === -1) {
      return null;
    }
    
    const updatedDriver = { ...currentDrivers[driverIndex], ...updates };
    const updatedDrivers = [...currentDrivers];
    updatedDrivers[driverIndex] = updatedDriver;
    
    this.driversSubject.next(updatedDrivers);
    this.driversSignal.set(updatedDrivers);
    
    return updatedDriver;
  }

  deleteDriver(id: string): boolean {
    const currentDrivers = this.driversSubject.value;
    const updatedDrivers = currentDrivers.filter(driver => driver.id !== id);
    
    if (updatedDrivers.length === currentDrivers.length) {
      return false; // Driver not found
    }
    
    this.driversSubject.next(updatedDrivers);
    this.driversSignal.set(updatedDrivers);
    
    return true;
  }

  getDriver(id: string): Driver | null {
    return this.driversSubject.value.find(driver => driver.id === id) || null;
  }

  // Route methods
  addRoute(routeData: CreateRouteRequest): Route {
    const newRoute: Route = {
      id: this.generateId(),
      ...routeData,
      status: 'unassigned',
      createdAt: new Date()
    };
    
    const currentRoutes = this.routesSubject.value;
    const updatedRoutes = [...currentRoutes, newRoute];
    
    this.routesSubject.next(updatedRoutes);
    this.routesSignal.set(updatedRoutes);
    
    return newRoute;
  }

  updateRoute(id: string, updates: Partial<Route>): Route | null {
    const currentRoutes = this.routesSubject.value;
    const routeIndex = currentRoutes.findIndex(route => route.id === id);
    
    if (routeIndex === -1) {
      return null;
    }
    
    const updatedRoute = { ...currentRoutes[routeIndex], ...updates };
    const updatedRoutes = [...currentRoutes];
    updatedRoutes[routeIndex] = updatedRoute;
    
    this.routesSubject.next(updatedRoutes);
    this.routesSignal.set(updatedRoutes);
    
    return updatedRoute;
  }

  deleteRoute(id: string): boolean {
    const currentRoutes = this.routesSubject.value;
    const updatedRoutes = currentRoutes.filter(route => route.id !== id);
    
    if (updatedRoutes.length === currentRoutes.length) {
      return false; // Route not found
    }
    
    this.routesSubject.next(updatedRoutes);
    this.routesSignal.set(updatedRoutes);
    
    return true;
  }

  getRoute(id: string): Route | null {
    return this.routesSubject.value.find(route => route.id === id) || null;
  }

  // Assignment methods
  assignDriverToRoute(driverId: string, routeId: string): boolean {
    const driver = this.getDriver(driverId);
    const route = this.getRoute(routeId);
    
    if (!driver || !route || !driver.isAvailable || route.status !== 'unassigned') {
      return false;
    }
    
    // Update driver
    const updatedDriver = this.updateDriver(driverId, {
      isAvailable: false,
      assignedRoutes: [...driver.assignedRoutes, routeId]
    });
    
    // Update route
    const updatedRoute = this.updateRoute(routeId, {
      status: 'assigned',
      assignedDriverId: driverId,
      assignedDriverName: driver.name
    });
    
    return updatedDriver !== null && updatedRoute !== null;
  }

  unassignDriverFromRoute(driverId: string, routeId: string): boolean {
    const driver = this.getDriver(driverId);
    const route = this.getRoute(routeId);
    
    if (!driver || !route || route.assignedDriverId !== driverId) {
      return false;
    }
    
    // Update driver
    const updatedDriver = this.updateDriver(driverId, {
      isAvailable: true,
      assignedRoutes: driver.assignedRoutes.filter(id => id !== routeId)
    });
    
    // Update route
    const updatedRoute = this.updateRoute(routeId, {
      status: 'unassigned',
      assignedDriverId: undefined,
      assignedDriverName: undefined
    });
    
    return updatedDriver !== null && updatedRoute !== null;
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private initializeMockData(): void {
    // Mock drivers
    const mockDrivers: Driver[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0123',
        licenseNumber: 'DL123456',
        isAvailable: true,
        assignedRoutes: [],
        experience: 5,
        vehicleType: 'truck',
        rating: 4.5,
        joinDate: new Date('2023-01-15')
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1-555-0124',
        licenseNumber: 'DL123457',
        isAvailable: true,
        assignedRoutes: [],
        experience: 3,
        vehicleType: 'van',
        rating: 4.8,
        joinDate: new Date('2023-03-20')
      },
      {
        id: '3',
        name: 'Mike Wilson',
        email: 'mike.wilson@example.com',
        phone: '+1-555-0125',
        licenseNumber: 'DL123458',
        isAvailable: false,
        assignedRoutes: ['route1'],
        experience: 7,
        vehicleType: 'truck',
        rating: 4.2,
        joinDate: new Date('2022-11-10')
      }
    ];

    // Mock routes
    const mockRoutes: Route[] = [
      {
        id: 'route1',
        name: 'Downtown Delivery',
        startLocation: 'Warehouse A',
        endLocation: 'Downtown Office',
        distance: 15,
        estimatedDuration: 45,
        assignedDriverId: '3',
        assignedDriverName: 'Mike Wilson',
        status: 'assigned',
        priority: 'high',
        scheduledDate: new Date('2024-01-15'),
        vehicleType: 'truck',
        description: 'Urgent delivery to downtown office',
        createdAt: new Date('2024-01-10')
      },
      {
        id: 'route2',
        name: 'Suburban Route',
        startLocation: 'Warehouse B',
        endLocation: 'Suburban Mall',
        distance: 25,
        estimatedDuration: 60,
        status: 'unassigned',
        priority: 'medium',
        scheduledDate: new Date('2024-01-16'),
        vehicleType: 'van',
        description: 'Regular delivery to suburban mall',
        createdAt: new Date('2024-01-11')
      }
    ];

    this.driversSubject.next(mockDrivers);
    this.driversSignal.set(mockDrivers);
    this.routesSubject.next(mockRoutes);
    this.routesSignal.set(mockRoutes);
  }
}