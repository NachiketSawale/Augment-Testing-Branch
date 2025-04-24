/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePesAccrualModeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePesAccrualModeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPesAccrualModeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePesAccrualModeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/pesaccrualmode/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b82fd36f2c7444c09efd3ecf21477ef5',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePesAccrualModeEntity) => x.DescriptionInfo),
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
