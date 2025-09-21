export interface Route {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number; // in kilometers
  estimatedDuration: number; // in minutes
  assignedDriverId?: string;
  assignedDriverName?: string;
  status: 'unassigned' | 'assigned' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  scheduledDate: Date;
  vehicleType: 'sedan' | 'suv' | 'van' | 'truck';
  description?: string;
  createdAt: Date;
}

export interface CreateRouteRequest {
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high';
  scheduledDate: Date;
  vehicleType: 'sedan' | 'suv' | 'van' | 'truck';
  description?: string;
}
