/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePrcPackageTemplateItemEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePrcPackageTemplateItemEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPrcPackageTemplateItemLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePrcPackageTemplateItemEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/prcpackagetemplateitem/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8c18b6af8be74a6b92bd6179129521e9',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePrcPackageTemplateItemEntity) => x.DescriptionInfo),
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
						id: 'PackagetemplateFk',
						model: 'PackagetemplateFk',
						type: FieldType.Quantity,
						label: { text: 'PackagetemplateFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'StructureFk',
						model: 'StructureFk',
						type: FieldType.Quantity,
						label: { text: 'StructureFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ConfigurationFk',
						model: 'ConfigurationFk',
						type: FieldType.Quantity,
						label: { text: 'ConfigurationFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PackagetypeFk',
						model: 'PackagetypeFk',
						type: FieldType.Quantity,
						label: { text: 'PackagetypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
