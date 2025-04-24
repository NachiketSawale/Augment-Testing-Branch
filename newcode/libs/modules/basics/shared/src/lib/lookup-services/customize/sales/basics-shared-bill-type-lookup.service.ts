/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBillTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBillTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBillTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBillTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/billtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4fdaa007532c4b299345f6d803b86c8e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBillTypeEntity) => x.DescriptionInfo),
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
						id: 'Isprogress',
						model: 'Isprogress',
						type: FieldType.Boolean,
						label: { text: 'Isprogress' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCumulativeTransaction',
						model: 'IsCumulativeTransaction',
						type: FieldType.Boolean,
						label: { text: 'IsCumulativeTransaction' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsProforma',
						model: 'IsProforma',
						type: FieldType.Boolean,
						label: { text: 'IsProforma' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCreditMemo',
						model: 'IsCreditMemo',
						type: FieldType.Boolean,
						label: { text: 'IsCreditMemo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPaymentScheduleBalancing',
						model: 'IsPaymentScheduleBalancing',
						type: FieldType.Boolean,
						label: { text: 'IsPaymentScheduleBalancing' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPartialFinalInvoice',
						model: 'IsPartialFinalInvoice',
						type: FieldType.Boolean,
						label: { text: 'IsPartialFinalInvoice' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsSingle',
						model: 'IsSingle',
						type: FieldType.Boolean,
						label: { text: 'IsSingle' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TypeCode',
						model: 'TypeCode',
						type: FieldType.Quantity,
						label: { text: 'TypeCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsFinalInvoiceCorrection',
						model: 'IsFinalInvoiceCorrection',
						type: FieldType.Boolean,
						label: { text: 'IsFinalInvoiceCorrection' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPaymentSchedule',
						model: 'IsPaymentSchedule',
						type: FieldType.Boolean,
						label: { text: 'IsPaymentSchedule' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
