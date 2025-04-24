/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelAnnotationReferenceTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelAnnotationReferenceTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelAnnotationReferenceTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelAnnotationReferenceTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modelannotationreferencetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7d77ac5d33d443aeab75b059654e5b57',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModelAnnotationReferenceTypeEntity) => x.DescriptionInfo),
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
						id: 'IsDirected',
						model: 'IsDirected',
						type: FieldType.Boolean,
						label: { text: 'IsDirected' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
