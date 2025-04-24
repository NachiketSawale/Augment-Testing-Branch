/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeValueTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeValueTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedValueTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeValueTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/valuetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '14427441e2e8413c9252b56d40247fb4',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeValueTypeEntity) => x.DescriptionInfo),
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
						id: 'IsActualValue',
						model: 'IsActualValue',
						type: FieldType.Boolean,
						label: { text: 'IsActualValue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPreliminaryActual',
						model: 'IsPreliminaryActual',
						type: FieldType.Boolean,
						label: { text: 'IsPreliminaryActual' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAccrual',
						model: 'IsAccrual',
						type: FieldType.Boolean,
						label: { text: 'IsAccrual' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAdditional',
						model: 'IsAdditional',
						type: FieldType.Boolean,
						label: { text: 'IsAdditional' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsActualForRevenueRecognition',
						model: 'IsActualForRevenueRecognition',
						type: FieldType.Boolean,
						label: { text: 'IsActualForRevenueRecognition' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
