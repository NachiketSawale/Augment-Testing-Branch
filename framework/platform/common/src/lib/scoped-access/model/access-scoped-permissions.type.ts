/*
 * Copyright(c) RIB Software GmbH
 */

import { Permissions } from '../../model/permission/permissions.enum';
import { AccessScope } from './access-scope.enum';

/**
 * An object type that can be used to specify permissions per access role.
 *
 * For each scope, a single permission item or an array of permission items may be provided.
 * Each permission item is expected to be an access right descriptor UUID, or an array of such strings.
 * If the string does not end with a permission specifier (e.g. `#c` for the *create* permission), the {@link permission} attribute must be provided and will be used as a fallback.
 */
export type AccessScopedPermissions = {
	permission?: Permissions
} & ({
	[AccessScope.User]: string | string[],
	[AccessScope.Role]: string | string[],
	[AccessScope.Global]: string | string[]
} | {
	u: string | string[],
	r: string | string[],
	g: string | string[]
} | {
	user: string | string[],
	role: string | string[],
	system: string | string[]
});
