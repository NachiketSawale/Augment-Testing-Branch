/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';

import {IRoleLookupProvider, IRoleLookupOptions, ROLE_LOOKUP_PROVIDER_TOKEN} from '@libs/usermanagement/interfaces';
import {UsermanagementRoleLookupService } from './role-lookup-data.service';

/**
 * Provides user-related lookups.
 */
@LazyInjectable
({
	token: ROLE_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})

export class UsermanagementRoleLookupProviderService implements IRoleLookupProvider{
	/**
	 * Generates a lookup field overload definition to pick a group.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateRoleLookup<T extends object>(options?: IRoleLookupOptions): TypedConcreteFieldOverload<T>{
		return {
			type: FieldType.Lookup,
			lookupOptions:createLookup({
				dataServiceToken: UsermanagementRoleLookupService,
				showDialog: true,
				dialogOptions: {
					//TODO: basics.reporting.dialogTitleReport
					headerText: 'Access Role Selection',
				},
				descriptionMember: 'Name',
				showDescription: true,
				gridConfig: {
					uuid: '3e81897650174fc7b320c0265c6c4dac',
					columns: [
						{
							id: 'name',
							model: 'Name',
							type: FieldType.Description,
							//TODO: basics.reporting.name
							label: 'Role Name',
							sortable: true,
							visible: true,
							readonly: true,
						},
						{
							id: 'description',
							model: 'Description',
							type: FieldType.Description,
							//TODO: basics.reporting.description
							label: 'Role Description',
							sortable: true,
							visible: true,
							readonly: true,
						},
					],
				},
			})
		};
	}
}
