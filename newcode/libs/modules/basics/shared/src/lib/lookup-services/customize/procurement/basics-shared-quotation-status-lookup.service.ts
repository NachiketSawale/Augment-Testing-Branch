/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQuotationStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQuotationStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQuotationStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQuotationStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/quotationstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f31898cfa5f64494b17867ae52f7d4b4',
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
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
						id: 'IsQuoted',
						model: 'IsQuoted',
						type: FieldType.Boolean,
						label: { text: 'IsQuoted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsOrdered',
						model: 'IsOrdered',
						type: FieldType.Boolean,
						label: { text: 'IsOrdered' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsVirtual',
						model: 'IsVirtual',
						type: FieldType.Boolean,
						label: { text: 'IsVirtual' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsProtected',
						model: 'IsProtected',
						type: FieldType.Boolean,
						label: { text: 'IsProtected' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ShowInPriceComparison',
						model: 'ShowInPriceComparison',
						type: FieldType.Boolean,
						label: { text: 'ShowInPriceComparison' },
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
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsIdealQuote',
						model: 'IsIdealQuote',
						type: FieldType.Boolean,
						label: { text: 'IsIdealQuote' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBaselineUpdateInvalid',
						model: 'IsBaselineUpdateInvalid',
						type: FieldType.Boolean,
						label: { text: 'IsBaselineUpdateInvalid' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
