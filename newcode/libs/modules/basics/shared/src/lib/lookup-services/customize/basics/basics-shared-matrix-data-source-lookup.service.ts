/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMatrixDataSourceEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMatrixDataSourceEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMatrixDataSourceLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMatrixDataSourceEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/matrixdatasource/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '88c80d7adea748baa3721d2d74563591',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeMatrixDataSourceEntity) => x.DescriptionInfo),
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
						id: 'EntityidentifierVer',
						model: 'EntityidentifierVer',
						type: FieldType.Comment,
						label: { text: 'EntityidentifierVer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EntityidentifierHor',
						model: 'EntityidentifierHor',
						type: FieldType.Comment,
						label: { text: 'EntityidentifierHor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EntityidentifierCel',
						model: 'EntityidentifierCel',
						type: FieldType.Comment,
						label: { text: 'EntityidentifierCel' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
