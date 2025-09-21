export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  isAvailable: boolean;
  assignedRoutes: string[];
  experience: number; // years of experience
  vehicleType: 'sedan' | 'suv' | 'van' | 'truck';
  rating: number; // 1-5 stars
  joinDate: Date;
}

export interface CreateDriverRequest {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  experience: number;
  vehicleType: 'sedan' | 'suv' | 'van' | 'truck';
}
