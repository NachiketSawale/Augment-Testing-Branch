/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePackageStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePackageStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPackageStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePackageStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/packagestatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '333df1ae495d4f4dbee0feebed4a94fe',
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsUpdateImport',
						model: 'IsUpdateImport',
						type: FieldType.Boolean,
						label: { text: 'IsUpdateImport' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsEstimate',
						model: 'IsEstimate',
						type: FieldType.Boolean,
						label: { text: 'IsEstimate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsContracted',
						model: 'IsContracted',
						type: FieldType.Boolean,
						label: { text: 'IsContracted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsRequested',
						model: 'IsRequested',
						type: FieldType.Boolean,
						label: { text: 'IsRequested' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBaselineUpdatedAward',
						model: 'IsBaselineUpdatedAward',
						type: FieldType.Boolean,
						label: { text: 'IsBaselineUpdatedAward' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
