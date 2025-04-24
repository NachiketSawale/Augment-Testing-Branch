/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResRequisitionResDateEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResRequisitionResDateEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResRequisitionResDateLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResRequisitionResDateEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/resrequisitionresdate/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f4c3cffca5ad43e3b9332fcf075b962f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeResRequisitionResDateEntity) => x.DescriptionInfo),
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
						id: 'Backgroundcolor',
						model: 'Backgroundcolor',
						type: FieldType.Quantity,
						label: { text: 'Backgroundcolor' },
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
						id: 'Isreserved',
						model: 'Isreserved',
						type: FieldType.Boolean,
						label: { text: 'Isreserved' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Delaylessthan',
						model: 'Delaylessthan',
						type: FieldType.Quantity,
						label: { text: 'Delaylessthan' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
