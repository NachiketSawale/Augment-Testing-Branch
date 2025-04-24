/*
 * Copyright(c) RIB Software GmbH
 */

import { AccessScope, LazyInjectionToken } from '@libs/platform/common';
import { ISelectItem } from '@libs/ui/common';

/**
 * Generates UI objects to select access scopes.
 */
export interface IAccessScopeUiHelper {

	/**
	 * Generates items suitable for a select control for the selected set of access scopes.
	 *
	 * @param includeScopes Lists the access scopes to include.
	 *
	 * @returns The select items.
	 */
	createSelectItems(includeScopes: {
		[scope in Partial<AccessScope>]: boolean
	}): ISelectItem<string>[];

	/**
	 * Generates items suitable for a select control for access scopes listed in an array.
	 *
	 * @param includeScopes Lists the access scopes to include.
	 *
	 * @returns The select items.
	 */
	createSelectItems(includeScopes: AccessScope[]): ISelectItem<string>[];

	/**
	 * Generates items suitable for a select control and optionally includes {@link AccessScope.Portal}.
	 *
	 * @param includePortal Indicates whether to include the portal access scope.
	 *
	 * @returns The select items.
	 */
	createSelectItems(includePortal: boolean): ISelectItem<string>[];
}

export const ACCESS_SCOPE_UI_HELPER_TOKEN = new LazyInjectionToken<IAccessScopeUiHelper>('access-scope-ui-helper');
