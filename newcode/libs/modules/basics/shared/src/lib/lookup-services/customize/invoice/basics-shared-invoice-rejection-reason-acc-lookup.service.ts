/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeInvoiceRejectionReasonAccEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeInvoiceRejectionReasonAccEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedInvoiceRejectionReasonAccLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeInvoiceRejectionReasonAccEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/invoicerejectionreasonacc/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '948928f2aca843a5b98d753e0a0eafcf',
			valueMember: 'Id',
			displayMember: 'RejectionreasonFk',
			gridConfig: {
				columns: [
					{
						id: 'RejectionreasonFk',
						model: 'RejectionreasonFk',
						type: FieldType.Quantity,
						label: { text: 'RejectionreasonFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'LedgerContextFk',
						model: 'LedgerContextFk',
						type: FieldType.Quantity,
						label: { text: 'LedgerContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TaxCodeFk',
						model: 'TaxCodeFk',
						type: FieldType.Quantity,
						label: { text: 'TaxCodeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Account',
						model: 'Account',
						type: FieldType.Code,
						label: { text: 'Account' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
