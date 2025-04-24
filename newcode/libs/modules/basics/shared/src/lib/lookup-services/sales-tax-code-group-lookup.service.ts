/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import {SalesTaxCodeGroupEntity} from './entities/sales-tax-code-group-entity.class';
import {Injectable} from '@angular/core';

/**
 * Basics Shared Sales Tax Code Group Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedSalesTaxCodeGroupLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<SalesTaxCodeGroupEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('SalesTaxGroup', {
			uuid: '1c1a1b7f1f3b42818c7a9fe1a4509f3a',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '6b452cccf2034a758ecdf124ca7d22c5',
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'desc',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}