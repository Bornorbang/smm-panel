import { api, Service } from "@/lib/api";

let servicesPromise: Promise<Service[]> | null = null;

export function loadServices(): Promise<Service[]> {
  if (!servicesPromise) {
    servicesPromise = api<{ services: Service[] }>("/api/services")
      .then((result) => result.services)
      .catch((error) => {
        servicesPromise = null;
        throw error;
      });
  }
  return servicesPromise;
}

export function preloadServices(): void {
  void loadServices().catch(() => undefined);
}
