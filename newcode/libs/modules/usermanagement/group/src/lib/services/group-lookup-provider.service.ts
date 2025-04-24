/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';

import { IGroupLookupProvider, IGroupLookupOptions, GROUP_LOOKUP_PROVIDER_TOKEN } from '@libs/usermanagement/interfaces';
import { UsermanagementGroupLookupService } from './group-lookup-data.service';

/**
 * Provides user-related lookups.
 */
@LazyInjectable
({
	token: GROUP_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})

export class UsermanagementGroupLookupProviderService implements IGroupLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick a group.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateGroupLookup<T extends object>(options?: IGroupLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: UsermanagementGroupLookupService,
				showDialog: true,
				dialogOptions: {
					headerText: {key: 'usermanagement.group.dialogTitleGroup'},
				},
				gridConfig: {
					uuid: 'd7d15f594e5847eab1cb7eacc7712eb1',
					columns: [{
						id: 'name',
						model: 'Name',
						type: FieldType.Description,
						label: {key: 'usermanagement.group.groupName'},
						sortable: true,
						visible: true,
						readonly: true
					}, {
						id: 'description',
						model: 'Description',
						type: FieldType.Description,
						label: {key: 'usermanagement.group.groupDescription'},
						sortable: true,
						visible: true,
						readonly: true
					}, {
						id: 'UserName',
						model: 'UserName',
						type: FieldType.Description,
						label: {key: 'usermanagement.group.entityUserLogonName'},
						sortable: true,
						visible: true,
						readonly: true
					}, {
						id: 'GroupDomainSID',
						model: 'GroupDomainSID',
						type: FieldType.Description,
						label: {key: 'usermanagement.group.groupDomainSID'},
						sortable: true,
						visible: true,
						readonly: true
					}, {
						id: 'UserProviderUniqueIdentifier',
						model: 'UserProviderUniqueIdentifier',
						type: FieldType.Description,
						label: {key: 'usermanagement.group.entityUserProviderUniqueIdentifier'},
						sortable: true,
						visible: true,
						readonly: true
					}]
				}
			})
		};
	}
}
