/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstAssemblyTypeLogicEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstAssemblyTypeLogicEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstAssemblyTypeLogicLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstAssemblyTypeLogicEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/estassemblytypelogic/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '29503a72dca94fb48d80df45137db707',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEstAssemblyTypeLogicEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
