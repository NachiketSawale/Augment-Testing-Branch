/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMaterialTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMaterialTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMaterialTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMaterialTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/materialtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'fd9fbfe4fd6246b195ee14810565e365',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeMaterialTypeEntity) => x.DescriptionInfo),
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
						id: 'IsForEstimate',
						model: 'IsForEstimate',
						type: FieldType.Boolean,
						label: { text: 'IsForEstimate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForProcurement',
						model: 'IsForProcurement',
						type: FieldType.Boolean,
						label: { text: 'IsForProcurement' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForRessourceManagement',
						model: 'IsForRessourceManagement',
						type: FieldType.Boolean,
						label: { text: 'IsForRessourceManagement' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForLogistic',
						model: 'IsForLogistic',
						type: FieldType.Boolean,
						label: { text: 'IsForLogistic' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForModel',
						model: 'IsForModel',
						type: FieldType.Boolean,
						label: { text: 'IsForModel' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForSales',
						model: 'IsForSales',
						type: FieldType.Boolean,
						label: { text: 'IsForSales' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
