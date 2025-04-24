/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementConfigurationHeaderTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementConfigurationHeaderTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementConfigurationHeaderTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementConfigurationHeaderTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/procurementconfigurationheadertype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2761a74e981c4b9495e7228a3d085af9',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProcurementConfigurationHeaderTypeEntity) => x.DescriptionInfo),
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
						id: 'IsMaterial',
						model: 'IsMaterial',
						type: FieldType.Boolean,
						label: { text: 'IsMaterial' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsEquipment',
						model: 'IsEquipment',
						type: FieldType.Boolean,
						label: { text: 'IsEquipment' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsService',
						model: 'IsService',
						type: FieldType.Boolean,
						label: { text: 'IsService' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
