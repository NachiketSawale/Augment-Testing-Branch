/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePrjControllingUnitTemplateEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePrjControllingUnitTemplateEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPrjControllingUnitTemplateLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePrjControllingUnitTemplateEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/prjcontrollingunittemplate/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a34f349686b44213a74c17af26f7b964',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePrjControllingUnitTemplateEntity) => x.DescriptionInfo),
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
						id: 'Codetemplate',
						model: 'Codetemplate',
						type: FieldType.Comment,
						label: { text: 'Codetemplate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Codevalidation',
						model: 'Codevalidation',
						type: FieldType.Comment,
						label: { text: 'Codevalidation' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment01',
						model: 'Assignment01',
						type: FieldType.Comment,
						label: { text: 'Assignment01' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment02',
						model: 'Assignment02',
						type: FieldType.Comment,
						label: { text: 'Assignment02' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment03',
						model: 'Assignment03',
						type: FieldType.Comment,
						label: { text: 'Assignment03' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment04',
						model: 'Assignment04',
						type: FieldType.Comment,
						label: { text: 'Assignment04' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment05',
						model: 'Assignment05',
						type: FieldType.Comment,
						label: { text: 'Assignment05' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment06',
						model: 'Assignment06',
						type: FieldType.Comment,
						label: { text: 'Assignment06' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment07',
						model: 'Assignment07',
						type: FieldType.Comment,
						label: { text: 'Assignment07' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment08',
						model: 'Assignment08',
						type: FieldType.Comment,
						label: { text: 'Assignment08' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment09',
						model: 'Assignment09',
						type: FieldType.Comment,
						label: { text: 'Assignment09' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment10',
						model: 'Assignment10',
						type: FieldType.Comment,
						label: { text: 'Assignment10' },
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
