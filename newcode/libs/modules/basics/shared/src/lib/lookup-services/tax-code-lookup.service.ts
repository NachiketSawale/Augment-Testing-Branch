/*
 * Copyright(c) RIB Software GmbH
 */

import {FieldType, UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import { ITaxCodeEntity } from './entities/tax-code-entity.interface';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedCompanyContextService } from '../services';

/**
 * Tax code lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedTaxCodeLookupService<TEntity extends object> extends
	UiCommonLookupTypeLegacyDataService<ITaxCodeEntity, TEntity> {

	private readonly companyContextService = inject(BasicsSharedCompanyContextService);

	/**
	 * The constructor
	 */
	public constructor() {
		super('MdcTaxCode', {
			uuid: 'beb36d7a8e0d4ab7807e00bb2302e0fa',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode'
						},
						visible: true,
						sortable: false
					},
					{
						id: 'desc',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription'
						},
						visible: true,
						sortable: false
					},
					{
						id: 'vatPercent',
						model: 'VatPercent',
						type: FieldType.Decimal,
						label: {
							text: 'Vat Percent',
							key: 'cloud.common.entityVatPercent'
						},
						visible: true,
						sortable: false
					},
					{
						id: 'ValidFrom',
						model: 'ValidFrom',
						type: FieldType.Date,
						label: {
							text: 'Valid From',
							key: 'basics.materialcatalog.validFrom'
						},
						visible: true,
						sortable: false
					},
					{
						id: 'ValidTo',
						model: 'ValidTo',
						type: FieldType.Date,
						label: {
							text: 'Valid To',
							key: 'basics.materialcatalog.validTo'
						},
						visible: true,
						sortable: false
					}
				]
			},
			clientSideFilter: {
				execute: (item) =>{
					return item.IsLive && item.LedgerContextFk ===  this.companyContextService.loginCompanyEntity.LedgerContextFk;
				}
			}
		});
	}

}