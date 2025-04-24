/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';

import { IUserLookupProvider, IUserLookupOptions, USER_LOOKUP_PROVIDER_TOKEN } from '@libs/usermanagement/interfaces';
import { UsermanagementUserLookupService } from './user-lookup-data.service';

/**
 * Provides user-related lookups.
 */
@LazyInjectable
({
	token: USER_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})

export class UsermanagementUserLookupProviderService implements IUserLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick a user.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateUserLookup<T extends object>(options?: IUserLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: UsermanagementUserLookupService,
				showDialog: true,
				dialogOptions: {
					headerText: {key: 'usermanagement.user.dialogTitleUser'},
				},
				gridConfig: {
					columns: [{
						id: 'name',
						model: 'Name',
						type: FieldType.Description,
						label: {key: 'usermanagement.user.userName'},
						sortable: true,
						visible: true,
						readonly: true
					}, {
						id: 'description',
						model: 'Description',
						type: FieldType.Description,
						label: {key: 'usermanagement.user.userDescription'},
						sortable: true,
						visible: true,
						readonly: true
					}]
				}
			})
		};
	}
}