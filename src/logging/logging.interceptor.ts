import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const now = Date.now();

    console.log(`[${method}] ${url} - Request received`);
    return next.handle().pipe(
      tap(() =>
        console.log(`[${method}] ${url} - Responsed in ${Date.now() - now}ms`)),
    );
  }
}
