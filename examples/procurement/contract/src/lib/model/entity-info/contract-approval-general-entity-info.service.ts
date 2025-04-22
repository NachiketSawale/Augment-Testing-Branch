/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { GenericWizardEntityConfig } from '@libs/ui/business-base';
import { CONTARCT_APPROVAL_GENERALS_ENTITY_CONFIG } from '@libs/procurement/interfaces';
import { IPrcGeneralsEntity } from '@libs/procurement/common';
import { ProcurementContractGeneralsDataService } from '../../services/procurement-contract-generals-data.service';
import { PRC_CONTRACT_GENERAL_ENTITY_CONFIG } from './prc-contract-general-entity-info.model';


/**
 * A configuration class to provide entity grid configuration of "Generals" container within "Contract Approval Wizard".
 */
@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: CONTARCT_APPROVAL_GENERALS_ENTITY_CONFIG,
	useAngularInjection: true
})
export class ContractApprovalGeneralEntityConfig implements GenericWizardEntityConfig<IPrcGeneralsEntity> {
	public entityConfig = PRC_CONTRACT_GENERAL_ENTITY_CONFIG;
	public dataServiceType = ProcurementContractGeneralsDataService;
}