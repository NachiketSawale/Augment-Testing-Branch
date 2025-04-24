/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsCustomizeGeneralTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeGeneralTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class BasicsSharedGeneralTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeGeneralTypeEntity, T> {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: {route: 'basics/customize/generaltype/', endPointRead: 'list', usePostForRead: true}
		}, {
			uuid: '7bd48d3853554573857f1e7c78ccc83d',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeGeneralTypeEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'DescriptionInfo'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'LedgerContextFk',
						model: 'LedgerContextFk',
						type: FieldType.Quantity,
						label: {text: 'LedgerContextFk'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: {text: 'IsDefault'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCost',
						model: 'IsCost',
						type: FieldType.Boolean,
						label: {text: 'IsCost'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPercent',
						model: 'IsPercent',
						type: FieldType.Boolean,
						label: {text: 'IsPercent'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CrbPriceConditionTypeFk',
						model: 'CrbPriceConditionTypeFk',
						type: FieldType.Quantity,
						label: {text: 'CrbPriceConditionTypeFk'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsSales',
						model: 'IsSales',
						type: FieldType.Boolean,
						label: {text: 'IsSales'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsProcurement',
						model: 'IsProcurement',
						type: FieldType.Boolean,
						label: {text: 'IsProcurement'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ValueType',
						model: 'ValueType',
						type: FieldType.Quantity,
						label: {text: 'ValueType'},
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
