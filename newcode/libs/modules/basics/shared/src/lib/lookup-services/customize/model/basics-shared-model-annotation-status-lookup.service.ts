/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelAnnotationStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelAnnotationStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelAnnotationStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelAnnotationStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modelannotationstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'be40a13b9ac0413cba45cc8cd83df435',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModelAnnotationStatusEntity) => x.DescriptionInfo),
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsApproved',
						model: 'IsApproved',
						type: FieldType.Boolean,
						label: { text: 'IsApproved' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
