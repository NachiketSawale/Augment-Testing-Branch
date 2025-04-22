/*
 * Copyright(c) RIB Software GmbH
 */

import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

/**
 * Router guard which sends to identity server login page if not authenticated
 */
export class AuthGuard extends AutoLoginPartialRoutesGuard {
}
