/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementPaymentScheduleStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementPaymentScheduleStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementPaymentScheduleStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementPaymentScheduleStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/procurementpaymentschedulestatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7add0bbb790d4bcf906cad9d94a450dc',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProcurementPaymentScheduleStatusEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAgreed',
						model: 'IsAgreed',
						type: FieldType.Boolean,
						label: { text: 'IsAgreed' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsIssued',
						model: 'IsIssued',
						type: FieldType.Boolean,
						label: { text: 'IsIssued' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
