/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IBankEntity } from './entities/bank-entity.class.interface';


/**
 * State Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsShareBankLookupService<TEntity extends object = object> extends UiCommonLookupTypeLegacyDataService<IBankEntity, TEntity> {
	public constructor() {
		super('Bank', {
			uuid: '0bd600c128db49b3b19379e3a35c45f6',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'BankName',
			gridConfig: {
				columns: [
					{id: 'BankName',
						model: 'BankName',
						type: FieldType.Description,
						label: {text: 'BankName', key: 'cloud.common.entityBankName'},
						width: 100,
						sortable: true,
						visible: true
					},
					{id: 'Bic',
						model: 'Bic',
						type: FieldType.Description,
						label: {text: 'BankName', key: 'cloud.common.entityBankBic'},
						width: 100,
						sortable: true,
						visible: true
					},
					{id: 'SortCode',
						model: 'SortCode',
						type: FieldType.Description,
						label: {text: 'SortCode', key: 'cloud.common.entityBankSortCode'},
						width: 100,
						sortable: true,
						visible: true
					},
					{id: 'Country',
						model: 'Iso2',
						type: FieldType.Description,
						label: {text: 'Iso2', key: 'cloud.common.entityISO2'},
						width: 100,
						sortable: true,
						visible: true
					},
					{id: 'City',
						model: 'City',
						type: FieldType.Description,
						label: {text: 'City', key: 'cloud.common.entityCity'},
						width: 100,
						sortable: true,
						visible: true
					}
				]
			}
		},);

	}
}
