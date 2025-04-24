/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstEvaluationSequenceEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstEvaluationSequenceEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstEvaluationSequenceLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstEvaluationSequenceEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/estevaluationsequence/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4e46211b2d844d3c9cb04157dc23f848',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEstEvaluationSequenceEntity) => x.DescriptionInfo),
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
						id: 'Ischangeable',
						model: 'Ischangeable',
						type: FieldType.Boolean,
						label: { text: 'Ischangeable' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
