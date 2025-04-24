/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportPackageStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportPackageStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportPackageStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportPackageStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportpackagestatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '9327f93a90ea49858eeb7d549d07091a',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Backgroundcolor',
						model: 'Backgroundcolor',
						type: FieldType.Quantity,
						label: { text: 'Backgroundcolor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Fontcolor',
						model: 'Fontcolor',
						type: FieldType.Quantity,
						label: { text: 'Fontcolor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isinpackaging',
						model: 'Isinpackaging',
						type: FieldType.Boolean,
						label: { text: 'Isinpackaging' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Istransportable',
						model: 'Istransportable',
						type: FieldType.Boolean,
						label: { text: 'Istransportable' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isdeletable',
						model: 'Isdeletable',
						type: FieldType.Boolean,
						label: { text: 'Isdeletable' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userflag1',
						model: 'Userflag1',
						type: FieldType.Boolean,
						label: { text: 'Userflag1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userflag2',
						model: 'Userflag2',
						type: FieldType.Boolean,
						label: { text: 'Userflag2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isdelivered',
						model: 'Isdelivered',
						type: FieldType.Boolean,
						label: { text: 'Isdelivered' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
