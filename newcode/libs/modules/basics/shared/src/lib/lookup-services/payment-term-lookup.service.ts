/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

export interface IPaymentTermEntity {
	Id: number;
	Code: string;
	Description?: string;
	CalculationTypeFk: number;
	NetDays: number;
	Month: number;
	DayOfMonth: number;
	DiscountDays: number;
	DiscountPercent: number;
}

/**
 * PaymentTerm Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedPaymentTermLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IPaymentTermEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('PaymentTerm', {
			uuid: '365363e7f182484b8bc2869f9ceeee5b',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{id: 'code', model: 'Code', type: FieldType.Code, label: {text: 'Code', key: 'cloud.common.entityCode'}, sortable: true, visible: true, readonly: true, width: 100},
					{id: 'description', model: 'Description', type: FieldType.Description, label: {text: 'Description', key: 'cloud.common.entityDescription'}, sortable: true, visible: true, readonly: true, width: 200}
				]
			}
		});
	}
}