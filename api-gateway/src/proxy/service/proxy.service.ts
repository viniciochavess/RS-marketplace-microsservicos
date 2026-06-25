import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { serviceConfig } from 'src/config/gateway.config';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  constructor(private readonly httpService: HttpService) {}

  async proxyRequest(
    serviceName: keyof typeof serviceConfig,
    method: string,
    path: string,
    data?: any,
    headers?: any,
    userInfo?: any,
  ) {
    const service = serviceConfig[serviceName];
    const url = `${service.url}${path}`;
    this.logger.log(`Proxying request to ${url}`);

    try {
      const enhancedHeaders = {
        ...headers,
        'x-user-id': userInfo?.id,
        'x-user-email': userInfo?.email,
        'x-user-role': userInfo?.role,
      };
      const responseFirstValueFrom = await firstValueFrom(
        this.httpService.request({
          method: method.toLocaleLowerCase(),
          url,
          data,
          headers: enhancedHeaders,
          timeout: service.timeout,
        }),
      );
      const response = await this.httpService.request({});
    } catch (error) {
      this.logger.error(`Error proxying request to ${url}: ${error}`);
      throw error;
    }
  }
  async getServiceHealth(serviceName) {
    try {
      const service = serviceConfig[serviceName as keyof typeof serviceConfig];
      const response = await firstValueFrom(
        this.httpService.get(`${service.url}/health`, {
          timeout: 3000,
        }),
      );
      return { status: 'healthy', message: 'Service is responding' };
    } catch (error) {
      this.logger.error(`Health check failed for ${serviceName}: ${error}`);
      return { status: 'unhealthy', message: 'Service is not responding' };
    }
  }
}
