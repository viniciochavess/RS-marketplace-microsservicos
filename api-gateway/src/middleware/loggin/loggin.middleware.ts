import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LogginMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  use(req: any, res: any, next: () => void) {
    const { method, originalUrl, ip, headers } = req;
    const userAgent = req.get('user-agent') || 'Unknown';
    const startTime = Date.now();

    this.logger.log(
      `incoming request: ${method} ${originalUrl} from ${ip} with user agent ${userAgent}`,
    );
    res.on('finish', () => {
      const {statusCode} = res;
      const contentLength = res.getHeader('content-length') || 0;
      const duration = Date.now() - startTime;
      this.logger.log(
        `outgoing response: ${method} ${originalUrl} ${statusCode} ${contentLength} in ${duration}ms`,
      );
      if (statusCode >= 400) {
        this.logger.warn(
          `error response: ${method} ${originalUrl} ${statusCode} ${contentLength} in ${duration}ms`,
        );
      }
      res.on('error', (error: any) => {
        this.logger.error(`error response: ${method} ${originalUrl} ${error}`, error);
      });
      res.on("timeout", () => {
        this.logger.warn(`timeout response: ${method} ${originalUrl}`, "timeout");
        res.statusCode = 504;
        res.end();
      });

    })
    next();
  }
}
