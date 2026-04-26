export type MaintenanceStatus = 'Healthy' | 'Warning' | 'Critical';

export interface MaintenanceLog {
  date: string;
  description: string;
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
  serialNumber: string;
  owner: string;
  imageUrl?: string;
  maintenanceStatus: MaintenanceStatus;
  maintenanceLogs: MaintenanceLog[];
  purchaseHistory: PurchaseHistory[];
  createdAt: string;
}
