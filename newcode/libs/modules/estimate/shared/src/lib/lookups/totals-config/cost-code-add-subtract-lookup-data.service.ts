/*
 * Copyright(c) RIB Software GmbH
 */
import { PlatformTranslateService } from '@libs/platform/common';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';

/**
 * Service for cost code add subtract lookup.
 */
@Injectable({
	providedIn: 'root',
})
export class CostCodeAddSubtractLookupDataService<TEntity extends object = object> extends UiCommonLookupItemsDataService<{ Id: number; ShortKeyInfo: object; DescriptionInfo: object; Sorting: number; }, TEntity>{
	public constructor(private translate: PlatformTranslateService) {
		super([
			{
				Id: 1,
				ShortKeyInfo: {
					Description: '+addition',
					DescriptionTr: 0,
					DescriptionModified: false,
					Translated: '+',
					VersionTr: 0,
					Modified: false,
					OtherLanguages: null,
				},
				DescriptionInfo: {
					Description: 'addition',
					DescriptionTr: null,
					DescriptionModified: false,
					Translated: 'addition',
					VersionTr: 0,
					Modified: false,
					OtherLanguages: null,
				},
				Sorting: 1,
			},
			{
				Id: 2,
				ShortKeyInfo: {
					Description: '-subtraction',
					DescriptionTr: 0,
					DescriptionModified: false,
					Translated: '-',
					VersionTr: 0,
					Modified: false,
					OtherLanguages: null,
				},
				DescriptionInfo: {
					Description: 'subtraction',
					DescriptionTr: null,
					DescriptionModified: false,
					Translated: 'subtraction',
					VersionTr: 0,
					Modified: false,
					OtherLanguages: null,
				},
				Sorting: 2,
			},
		], {
			uuid: '6dbacbf6d9b846de9b19a5dd9b6d7db8',
			displayMember: 'ShortKeyInfo.Translated',
			valueMember: 'Id'
		});
	}
}