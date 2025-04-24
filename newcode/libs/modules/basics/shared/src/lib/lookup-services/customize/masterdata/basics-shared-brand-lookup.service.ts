/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBrandEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBrandEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBrandLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBrandEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/brand/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '01d2e2a32c7344b1ac1c73d0f9b12ade',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBrandEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
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
						id: 'ContextFk',
						model: 'ContextFk',
						type: FieldType.Quantity,
						label: { text: 'ContextFk' },
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
						id: 'UserDefinedText1',
						model: 'UserDefinedText1',
						type: FieldType.Description,
						label: { text: 'UserDefinedText1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedText2',
						model: 'UserDefinedText2',
						type: FieldType.Description,
						label: { text: 'UserDefinedText2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedText3',
						model: 'UserDefinedText3',
						type: FieldType.Description,
						label: { text: 'UserDefinedText3' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedText4',
						model: 'UserDefinedText4',
						type: FieldType.Description,
						label: { text: 'UserDefinedText4' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedText5',
						model: 'UserDefinedText5',
						type: FieldType.Description,
						label: { text: 'UserDefinedText5' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedDate1',
						model: 'UserDefinedDate1',
						type: FieldType.DateUtc,
						label: { text: 'UserDefinedDate1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedDate2',
						model: 'UserDefinedDate2',
						type: FieldType.DateUtc,
						label: { text: 'UserDefinedDate2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedDate3',
						model: 'UserDefinedDate3',
						type: FieldType.DateUtc,
						label: { text: 'UserDefinedDate3' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedDate4',
						model: 'UserDefinedDate4',
						type: FieldType.DateUtc,
						label: { text: 'UserDefinedDate4' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedDate5',
						model: 'UserDefinedDate5',
						type: FieldType.DateUtc,
						label: { text: 'UserDefinedDate5' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedNumber1',
						model: 'UserDefinedNumber1',
						type: FieldType.Quantity,
						label: { text: 'UserDefinedNumber1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedNumber2',
						model: 'UserDefinedNumber2',
						type: FieldType.Quantity,
						label: { text: 'UserDefinedNumber2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedNumber3',
						model: 'UserDefinedNumber3',
						type: FieldType.Quantity,
						label: { text: 'UserDefinedNumber3' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedNumber4',
						model: 'UserDefinedNumber4',
						type: FieldType.Quantity,
						label: { text: 'UserDefinedNumber4' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedNumber5',
						model: 'UserDefinedNumber5',
						type: FieldType.Quantity,
						label: { text: 'UserDefinedNumber5' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
