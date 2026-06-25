import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ProxyService } from './proxy/service/proxy.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly proxyService: ProxyService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  async getHealth() {
    const [users, products, checkout, payment] = await Promise.all([
      this.proxyService.getServiceHealth('users'),
      this.proxyService.getServiceHealth('products'),
      this.proxyService.getServiceHealth('checkout'),
      this.proxyService.getServiceHealth('payment'),
    ]);

    return {
      status: 'ok',
      message: 'API Gateway is running',
      timestamp: new Date().toISOString(),
      services: { users, products, checkout, payment },
    };
  }
}
