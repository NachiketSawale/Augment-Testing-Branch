/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCustomerLedgerGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCustomerLedgerGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCustomerLedgerGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCustomerLedgerGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/customerledgergroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ea2d746763fe49b7bc7c58eb8f7e7a44',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCustomerLedgerGroupEntity) => x.DescriptionInfo),
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
						id: 'AccountReceivables',
						model: 'AccountReceivables',
						type: FieldType.Code,
						label: { text: 'AccountReceivables' },
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
						id: 'RetentionReceivables',
						model: 'RetentionReceivables',
						type: FieldType.Code,
						label: { text: 'RetentionReceivables' },
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
						id: 'DebtorGroup',
						model: 'DebtorGroup',
						type: FieldType.Code,
						label: { text: 'DebtorGroup' },
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
