/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
import { CosCreateInstanceType } from '../../enums/cos-create-instance-type.enum';

export const COS_CREATE_INSTANCE_OPTION_TOKEN = new InjectionToken<ICosCreateInstanceOption>('COS_CREATE_INSTANCE_OPTION_TOKEN');

export interface ICosCreateInstanceOption {
	disableCreateBySelectionStatement: boolean;
	createType: CosCreateInstanceType;
	onlyCreateHaveAssignObject: boolean;
	applyEstimateResultAutomatically: boolean;
	evaluateAndCalculate?: boolean;
}
