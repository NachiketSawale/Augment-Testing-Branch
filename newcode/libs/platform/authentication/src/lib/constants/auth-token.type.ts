import { InjectionToken } from '@angular/core';
import { IAuthConfig } from '../interfaces/auth-config.interface';

/**
 * Injection token of type IAuthConfig
 */
export const PLATFORM_AUTH_CONFIG = new InjectionToken<IAuthConfig>('AUTH_CONFIG');