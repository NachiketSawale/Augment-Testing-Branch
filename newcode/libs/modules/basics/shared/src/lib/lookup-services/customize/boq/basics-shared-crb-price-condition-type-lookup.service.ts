/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCrbPriceConditionTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCrbPriceConditionTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCrbPriceConditionTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCrbPriceConditionTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/crbpriceconditiontype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '72be892b3cb64ccdb2ea2c62bdd1899e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCrbPriceConditionTypeEntity) => x.DescriptionInfo),
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
						id: 'IsGeneralstype',
						model: 'IsGeneralstype',
						type: FieldType.Boolean,
						label: { text: 'IsGeneralstype' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
