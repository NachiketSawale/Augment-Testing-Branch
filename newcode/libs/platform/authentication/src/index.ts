/*
 * Copyright(c) RIB Software GmbH
 */

export * from './lib/platform-authentication.module';

export { AuthGuard } from './lib/guards/auth.guard';
export { PlatformAuthService } from './lib/services/platform-auth.service';
export { IAuthConfig } from './lib/interfaces/auth-config.interface';
export { AuthInterceptorService } from './lib/services/auth-interceptor.service';
export { PLATFORM_AUTH_CONFIG } from './lib/constants/auth-token.type';