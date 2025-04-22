/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity, IPackage2HeaderEntity, IPrcPackageEntity } from '@libs/procurement/interfaces';
import { IConfirmCreateContractResponse } from '../../response/confirm-create-contract-response';
import { ProcurementCreateContractMode } from '../../enums';
import { InjectionToken } from '@angular/core';
import { IReqHeaderEntity } from '../../entities/prc-req-header-entity.interface';

export interface ICreateContractWizardProvider {
	package?: IPrcPackageEntity;
	subPackage?: IPackage2HeaderEntity;
	hasContractItem?: boolean;
	changeOrderData?: IConfirmCreateContractResponse;
	changeOrderContract?: IConHeaderEntity[];
	mode: ProcurementCreateContractMode;
	reqHeader:IReqHeaderEntity;

	//todo
	// add resultPromise
}
export const CREATE_CONTRACT_WIZARD_OPTIONS_TOKEN = new InjectionToken<ICreateContractWizardProvider>('create-contract-wizard-options-token');
