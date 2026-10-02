import { Request, Response } from 'express';
import { HealthService } from '../services/healthService';
import { ApiResponse, HealthCheckData } from '../types';

export class HealthController {
  public static getHealth(req: Request, res: Response): void {
    const healthData: HealthCheckData = HealthService.getHealthStatus();
    const response: ApiResponse<HealthCheckData> = {
      success: true,
      data: healthData,
      message: 'Server is running and healthy'
    };
    res.status(200).json(response);
  }
}
