/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSupplierLedgerGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSupplierLedgerGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSupplierLedgerGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSupplierLedgerGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/supplierledgergroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '95987b57b60d471988de595fa469bf5a',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeSupplierLedgerGroupEntity) => x.DescriptionInfo),
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
						id: 'SubledgerContextFk',
						model: 'SubledgerContextFk',
						type: FieldType.Quantity,
						label: { text: 'SubledgerContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccountPayables',
						model: 'AccountPayables',
						type: FieldType.Code,
						label: { text: 'AccountPayables' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccountInstallment',
						model: 'AccountInstallment',
						type: FieldType.Code,
						label: { text: 'AccountInstallment' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RetentionPayables',
						model: 'RetentionPayables',
						type: FieldType.Code,
						label: { text: 'RetentionPayables' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RetentionInstallment',
						model: 'RetentionInstallment',
						type: FieldType.Code,
						label: { text: 'RetentionInstallment' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'BusinessGroup',
						model: 'BusinessGroup',
						type: FieldType.Code,
						label: { text: 'BusinessGroup' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CreditorGroup',
						model: 'CreditorGroup',
						type: FieldType.Code,
						label: { text: 'CreditorGroup' },
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
