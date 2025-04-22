/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IBusinessPartnerAgreementLookupEntity } from '@libs/businesspartner/interfaces';
import {
	FieldType,
	UiCommonLookupTypeDataService
} from '@libs/ui/common';

/**
 * BusinessPartner agreement lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedBusinessPartnerAgreementLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IBusinessPartnerAgreementLookupEntity, TEntity> {

	/**
	 * The constructor
	 */
	public constructor() {
		super('Agreement', {
			uuid: '2602e4a91e7f4ab79743db6f0dbfcee4',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'description',
						model: 'Description',
						type: FieldType.Description,
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription'
						},
						width: 120,
						visible: true,
						sortable: false,
						readonly: true
					},
					{
						id: 'businessPartnerName1',
						model: 'BusinessPartnerName1',
						type: FieldType.Description,
						label: {
							text: 'Business Partner Name 1',
							key: 'businesspartner.main.name1'
						},
						width: 120,
						visible: true,
						sortable: false,
						readonly: true
					},
					{
						id: 'validFrom',
						model: 'ValidFrom',
						type: FieldType.DateUtc,
						label: {
							text: 'Valid From',
							key: 'cloud.common.entityValidFrom'
						},
						visible: true,
						sortable: false,
						readonly: true
					},
					{
						id: 'validTo',
						model: 'ValidTo',
						type: FieldType.DateUtc,
						label: {
							text: 'Valid To',
							key: 'cloud.common.entityValidTo'
						},
						visible: true,
						sortable: false,
						readonly: true
					}
				]
			}
		});
	}
}