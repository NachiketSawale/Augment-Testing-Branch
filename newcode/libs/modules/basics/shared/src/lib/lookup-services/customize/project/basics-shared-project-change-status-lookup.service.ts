/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectChangeStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectChangeStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectChangeStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectChangeStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectchangestatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '59e5087773dc4fa997134f0394edb31f',
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAccepted',
						model: 'IsAccepted',
						type: FieldType.Boolean,
						label: { text: 'IsAccepted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsRejected',
						model: 'IsRejected',
						type: FieldType.Boolean,
						label: { text: 'IsRejected' },
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
						id: 'IsIdentified',
						model: 'IsIdentified',
						type: FieldType.Boolean,
						label: { text: 'IsIdentified' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAnnounced',
						model: 'IsAnnounced',
						type: FieldType.Boolean,
						label: { text: 'IsAnnounced' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsSubmitted',
						model: 'IsSubmitted',
						type: FieldType.Boolean,
						label: { text: 'IsSubmitted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsWithDrawn',
						model: 'IsWithDrawn',
						type: FieldType.Boolean,
						label: { text: 'IsWithDrawn' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsRejectedWithProtest',
						model: 'IsRejectedWithProtest',
						type: FieldType.Boolean,
						label: { text: 'IsRejectedWithProtest' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAcceptedInPrinciple',
						model: 'IsAcceptedInPrinciple',
						type: FieldType.Boolean,
						label: { text: 'IsAcceptedInPrinciple' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FactorByReason',
						model: 'FactorByReason',
						type: FieldType.Quantity,
						label: { text: 'FactorByReason' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FactorByAmount',
						model: 'FactorByAmount',
						type: FieldType.Quantity,
						label: { text: 'FactorByAmount' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAllowedQtoForSales',
						model: 'IsAllowedQtoForSales',
						type: FieldType.Boolean,
						label: { text: 'IsAllowedQtoForSales' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAllowedQtoForProc',
						model: 'IsAllowedQtoForProc',
						type: FieldType.Boolean,
						label: { text: 'IsAllowedQtoForProc' },
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
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
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
					}
				]
			}
		});
	}
}
