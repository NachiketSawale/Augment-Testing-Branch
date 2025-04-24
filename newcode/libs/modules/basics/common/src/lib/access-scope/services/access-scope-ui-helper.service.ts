/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { AccessScope, LazyInjectable, PlatformCommonAccessScopeService } from '@libs/platform/common';
import { ISelectItem } from '@libs/ui/common';
import { ACCESS_SCOPE_UI_HELPER_TOKEN, IAccessScopeUiHelper } from '@libs/basics/interfaces';

/**
 * Generates UI objects to select access scopes.
 */
@Injectable({
	providedIn: 'root'
})
@LazyInjectable<IAccessScopeUiHelper>({
	token: ACCESS_SCOPE_UI_HELPER_TOKEN,
	useAngularInjection: true
})
export class BasicsCommonAccessScopeUiHelperService implements IAccessScopeUiHelper {

	private readonly accessScopeSvc = inject(PlatformCommonAccessScopeService);

	/**
	 * Generates items suitable for a select control for the selected set of access scopes.
	 *
	 * @param includeScopes Lists the access scopes to include.
	 *
	 * @returns The select items.
	 */
	public createSelectItems(includeScopes: {
		[scope in Partial<AccessScope>]: boolean
	}): ISelectItem<string>[];

	/**
	 * Generates items suitable for a select control for access scopes listed in an array.
	 *
	 * @param includeScopes Lists the access scopes to include.
	 *
	 * @returns The select items.
	 */
	public createSelectItems(includeScopes: AccessScope[]): ISelectItem<string>[];

	/**
	 * Generates items suitable for a select control and optionally includes {@link AccessScope.Portal}.
	 *
	 * @param includePortal Indicates whether to include the portal access scope.
	 *
	 * @returns The select items.
	 */
	public createSelectItems(includePortal: boolean): ISelectItem<string>[];

	public createSelectItems(config?: {
		[scope in Partial<AccessScope>]: boolean
	} | AccessScope[] | boolean): ISelectItem<string>[] {
		let included: {
			[scope in Partial<AccessScope>]?: boolean
		};

		if (Array.isArray(config)) {
			included = {};
			for (const as of config) {
				included[as] = true;
			}
		} else if (typeof config === 'object') {
			included = config;
		} else {
			included = {
				[AccessScope.Global]: true,
				[AccessScope.Role]: true,
				[AccessScope.User]: true,
				[AccessScope.Portal]: Boolean(config)
			};
		}

		return this.accessScopeSvc.getAllScopes()
			.filter(as => included[as])
			.map(as => this.accessScopeSvc.getInfo(as))
			.map(asInfo => {
				return <ISelectItem<string>>{
					id: asInfo.id,
					displayName: asInfo.title
				};
			});
	}
}
