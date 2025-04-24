/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBillAccrualModeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBillAccrualModeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBillAccrualModeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBillAccrualModeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/billaccrualmode/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '438ae7d71001498e9c53acd244195281',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBillAccrualModeEntity) => x.DescriptionInfo),
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Abbreviation',
						model: 'Abbreviation',
						type: FieldType.Code,
						label: { text: 'Abbreviation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
