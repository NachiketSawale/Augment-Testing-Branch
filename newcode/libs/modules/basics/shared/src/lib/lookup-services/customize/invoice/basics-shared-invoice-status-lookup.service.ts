/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeInvoiceStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeInvoiceStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedInvoiceStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeInvoiceStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/invoicestatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4bb276cf0f3e49808cebce0c56268c8d',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'IsPosted',
						model: 'IsPosted',
						type: FieldType.Boolean,
						label: { text: 'IsPosted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsVirtual',
						model: 'IsVirtual',
						type: FieldType.Boolean,
						label: { text: 'IsVirtual' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsChained',
						model: 'IsChained',
						type: FieldType.Boolean,
						label: { text: 'IsChained' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCanceled',
						model: 'IsCanceled',
						type: FieldType.Boolean,
						label: { text: 'IsCanceled' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsStock',
						model: 'IsStock',
						type: FieldType.Boolean,
						label: { text: 'IsStock' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptor01Fk',
						model: 'AccessrightDescriptor01Fk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptor01Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptor02Fk',
						model: 'AccessrightDescriptor02Fk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptor02Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptor03Fk',
						model: 'AccessrightDescriptor03Fk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptor03Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptor04Fk',
						model: 'AccessrightDescriptor04Fk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptor04Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptor05Fk',
						model: 'AccessrightDescriptor05Fk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptor05Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsValidateReference',
						model: 'IsValidateReference',
						type: FieldType.Boolean,
						label: { text: 'IsValidateReference' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ToBeVerifiedBl',
						model: 'ToBeVerifiedBl',
						type: FieldType.Boolean,
						label: { text: 'ToBeVerifiedBl' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsVerifedBl',
						model: 'IsVerifedBl',
						type: FieldType.Boolean,
						label: { text: 'IsVerifedBl' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReceiptLedger',
						model: 'IsReceiptLedger',
						type: FieldType.Boolean,
						label: { text: 'IsReceiptLedger' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptor06Fk',
						model: 'AccessrightDescriptor06Fk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptor06Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsRevenueRecognition',
						model: 'IsRevenueRecognition',
						type: FieldType.Boolean,
						label: { text: 'IsRevenueRecognition' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
