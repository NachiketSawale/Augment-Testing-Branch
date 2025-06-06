/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpAgreementTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpAgreementTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpAgreementTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpAgreementTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/bpagreementtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5d7d58394eae479495bfb89ceffac254',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBpAgreementTypeEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
