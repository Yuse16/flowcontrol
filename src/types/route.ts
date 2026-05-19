export interface RouteStep {
  id: string;
  label: string;
}

export interface OperationalRoute {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: string[]; // Sequential steps, e.g. ["Reportes", "Otros", "Operación"]
  createdAt: string;
  updatedAt: string;
}
