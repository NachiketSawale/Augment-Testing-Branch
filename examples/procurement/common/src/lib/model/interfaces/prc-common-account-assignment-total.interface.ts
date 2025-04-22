/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcCommonAccountAssignmentEntity } from '../entities/procurement-common-account-assignment-entity.interface';
import { ProviderToken } from '@angular/core';
import { IEntityList, IEntitySelection } from '@libs/platform/data-access';

/**
 * interface for account assignment total
 */
export interface IPrcCommonAccountAssignmentTotal<T extends IPrcCommonAccountAssignmentEntity> {
	dtos: T[];
	conCompanyCurrency: string;
	conHeaderCurrency: string;
	conTotalAmount: number;
	conTotalAmountOc: number;
	conTotalNet: number;
	conTotalNetOc: number;
	conTotalPercent: number;
	invCompanyCurrency: string;
	invHeaderCurrency: string;
	invoiceTotalAmount: number;
	invoiceTotalAmountOc: number;
	invoiceTotalNet: number;
	invoiceTotalNetOc: number;
	invoiceTotalPercent: number;
	previousInvCompanyCurrency: string;
	previousInvHeaderCurrency: string;
	previousInvoiceAmount: number;
	previousInvoiceAmountOc: number;
	previousInvoiceNet: number;
	previousInvoiceNetOc: number;

	[key: string]: string | number | T[];
}

export interface IProcurementCommonAccountAssignmentDataService<T extends IPrcCommonAccountAssignmentEntity> {
	readonly dataServiceToken: ProviderToken<IEntitySelection<T> & IEntityList<T>>;
}

export interface IProcurementCommonAccountAssignmentFieldRow {
	headerLabel: string; // The label for the row
	useInputControl?: boolean;
	fields: (keyof IPrcCommonAccountAssignmentTotal<IPrcCommonAccountAssignmentEntity>)[]; // The fields to display
}
