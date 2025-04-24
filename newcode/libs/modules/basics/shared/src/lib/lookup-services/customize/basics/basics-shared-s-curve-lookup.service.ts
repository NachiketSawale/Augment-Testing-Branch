/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSCurveEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSCurveEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSCurveLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSCurveEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/scurve/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1fa769c337a3415c96bb03102de9f7c3',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeSCurveEntity) => x.DescriptionInfo),
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
						id: 'Paymentdelay',
						model: 'Paymentdelay',
						type: FieldType.Quantity,
						label: { text: 'Paymentdelay' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Totaltype',
						model: 'Totaltype',
						type: FieldType.Code,
						label: { text: 'Totaltype' },
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
