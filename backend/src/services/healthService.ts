import { HealthCheckData } from '../types';
import { config } from '../config/env';

export class HealthService {
  public static getHealthStatus(): HealthCheckData {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: config.nodeEnv
    };
  }
}
