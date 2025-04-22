/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { IBusinessPartnerEntity, IDuplicateSimpleRequest } from '@libs/businesspartner/interfaces';

export interface IDiscardDuplicateDialogCustomOptions {
	showPage?: boolean;
	url?: string;
	checkData?: IDuplicateSimpleRequest;
	page?: {
		totalLength: number;
		currentLength: number
	}
}

export interface IDiscardDuplicateDialogData extends IDiscardDuplicateDialogCustomOptions {
	duplicateBps: IBusinessPartnerEntity[];
	model: string;
	sourceItemToCompare: IBusinessPartnerEntity;
}

export interface IValidateVatNoOrTaxNoRequest {
	MainItemId: number;
	Value: string;
	AddressFk?: number;
	CountryFk?: number;
	IsFromBp: boolean;
	IsVatNoField: boolean;
	IsEu: boolean;
}

export const DISCARD_DUPLICATE_DIALOG_DATA_TOKEN = new InjectionToken<IDiscardDuplicateDialogData>('discard-duplicate-dialog-data-token');

export enum DiscardDuplicateDialogExecutionType {
	discardAndDisplay = 1,
	ignore
}

export interface IDiscardDuplicateDialogResult {
	executionType: DiscardDuplicateDialogExecutionType;
	displayEntities?: IBusinessPartnerEntity[]
}
