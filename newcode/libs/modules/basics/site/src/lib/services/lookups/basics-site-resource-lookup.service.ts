/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeLegacyDataService, createLookup } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { BasicsSharedLogisticsDispatcherGroupLookupService, BasicsSharedResResourceKindLookupService, BasicsSharedResourceGroupLookupService, BasicsSharedResourceTypeLookupService } from '@libs/basics/shared';
import { BasicsSiteGridEntity } from '../../model/basics-site-grid-entity.class';

@Injectable({
	providedIn: 'root'
})
export class BasicsSiteResourceLookupService<IEntity extends object > extends UiCommonLookupTypeLegacyDataService <BasicsSiteGridEntity, IEntity >{
	public constructor(){
		super( 'resourcemasterresource', {
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showClearButton: true,
			showDialog: true,
			showGrid: false,
			gridConfig: {
				columns: [
					{
						id: 'Code',
						type: FieldType.Description,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						visible: true,
						readonly: true,
						sortable: true
					},
					{
						id: 'Description',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						visible: true,
						readonly: true,
						sortable: true
					},
					{
						id: 'KindFk',
						model: 'KindFk',
						type: FieldType.Lookup,
						label: { text: 'Kind', key: 'resource.master.KindFk' },
						visible: true,
						readonly: true,
						sortable: true,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedResResourceKindLookupService
						}),
					},
					{
						id: 'GroupFk',
						model: 'GroupFk',
						type: FieldType.Lookup,
						label: { text: 'Group', key: 'resource.master.GroupFk' },
						visible: true,
						readonly: true,
						sortable: true,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedResourceGroupLookupService
						}),
					},
					{
						id: 'TypeFk',
						type: FieldType.Lookup,
						model: 'TypeFk',
						label: { text: 'Type', key: 'resource.master.TypeFk' },
						visible: true,
						readonly: true,
						sortable: true,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedResourceTypeLookupService
						}),
					},
					{
						id: 'DispatcherGroupFk',
						model: 'DispatcherGroupFk',
						type: FieldType.Lookup,
						label: { text: 'Dispatch Group', key: 'basics.customize.logisticsdispatchergroup' },
						visible: true,
						readonly: true,
						sortable: true,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedLogisticsDispatcherGroupLookupService
						}),
					},
					{
						id: 'Validfrom',
						model: 'Validfrom',
						type: FieldType.Date,
						label: { text: 'Valid From', key: 'cloud.common.entityValidFrom' },
						readonly: true,
						sortable: true,
					},
					{
						id: 'Validto',
						model: 'Validto',
						type: FieldType.Date,
						label: { text: 'Valid To', key: 'cloud.common.entityValidTo' },
						readonly: true,
						sortable: true,
					}
				]
			},
			dialogOptions: {
				headerText: {
					text: 'Assign Resources',
				}
			},
			buildSearchString: (searchText: string) => {
				if(!searchText) {
					return '';
				} else {
					const searchString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")Or KindFk.Contains("%SEARCH%")Or GroupFk.Contains("%SEARCH%")Or TypeFk.Contains("%SEARCH%")Or Validfrom.Contains("%SEARCH%")Or Validto.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g, searchText);
				}
			},
			uuid: '84df11a330d04d3380dbca48da765101',
		});
	}

	// private SiteRow: FormRow<BasicsSiteGridEntity> = {
	// 	id: 'Site',
	// 	label: {
	// 		text: 'Site',
	// 		key: 'resource.master.SiteFk'
	// 	},
	// 	type: FieldType.Lookup,
	// 	lookupOptions: createLookup({
	// 		dataServiceToken: BasicsSiteLookupService,
	// 		showClearButton: true,
	// 	}),
	// 	model: 'StateFk',
	// 	sortOrder: 6,
	// 	readonly: false,
	// 	visible: false
	// };

	// public formConfig: IFormConfig<BasicsSiteGridEntity> = {
	// 	groups: [
	// 		{
	// 			groupId: 'baseGroup',
	// 			visible: true,
	// 			sortOrder: 1
	// 		}
	// 	],
	// 	rows: [

	// 		this.SiteRow,{
	// 			id: 'Site',
	// 			type: FieldType.Lookup,
	// 			label: { text: 'Site', key: 'resource.master.SiteFk' },
	// 			visible: true,
	// 			readonly: true,
	// 			lookupOptions: createLookup({
	// 				dataServiceToken: BasicsSiteSitetypeComboboxService
	// 			}),
	// 		},

	// 	]
	// }

}

