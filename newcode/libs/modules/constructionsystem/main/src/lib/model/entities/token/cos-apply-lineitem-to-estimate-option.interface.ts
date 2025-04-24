/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';

export const COS_APPLY_LINEITEME_TO_ESTIMATE_OPTION_TOKEN = new InjectionToken<ICosApplylineItemToEstimateOption>('COS_APPLY_LINEITEME_TO_ESTIMATE_OPTION_TOKEN');

export interface ICosApplylineItemToEstimateOption {
	overwrite: boolean;
	isUpdate: boolean;
	updateQuantity: boolean;
	updatePrice: boolean;
	keepResourcePackageAssignment: boolean;
	doNotUpdateResIfCosResIsNull: boolean;
}
