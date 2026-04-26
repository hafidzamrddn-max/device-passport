export type MaintenanceStatus = 'Healthy' | 'Warning' | 'Critical';
export type DeviceCategory = 'Electronic' | 'Furniture' | 'Vehicles' | 'Infrastructure' | 'Others';

export interface MaintenanceLog {
  date: string;
  description: string;
}

export interface LocationRecord {
  date: string;
  location: string;
}

export interface PurchaseHistory {
  date: string;
  seller: string;
}

export interface Device {
  id: string;
  name: string;
  model: string;
  brand: string;
  category: DeviceCategory;
  serialNumber: string;
  owner: string;
  currentLocation: string;
  locationHistory: LocationRecord[];
  imageUrl?: string;
  maintenanceStatus: MaintenanceStatus;
  maintenanceLogs: MaintenanceLog[];
  purchaseHistory: PurchaseHistory[];
  createdAt: string;
}
