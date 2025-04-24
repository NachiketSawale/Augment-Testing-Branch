/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePrcPackageTemplateEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePrcPackageTemplateEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPrcPackageTemplateLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePrcPackageTemplateEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/prcpackagetemplate/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c93ad9065db04085b39e49bd616bd588',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePrcPackageTemplateEntity) => x.DescriptionInfo),
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
