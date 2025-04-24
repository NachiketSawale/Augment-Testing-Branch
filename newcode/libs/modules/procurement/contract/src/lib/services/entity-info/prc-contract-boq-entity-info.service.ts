/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { GenericWizardEntityConfig } from '@libs/ui/business-base';
import { PRC_CONTRACT_BOQ_ENTITY_CONFIG, IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { ProcurementContractBoqDataService } from '../procurement-contract-boq.service';
import { PRC_CON_BOQ_ENTITY_CONFIG } from '../../model/entity-info/procurement-contract-boq-entity-info.model';

/**
 * A configuration class to provide entity configuration and relevant data service for "Contract Confirm Wizard".
 */
@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: PRC_CONTRACT_BOQ_ENTITY_CONFIG,
	useAngularInjection: true
})
export class PrcContractBoqEntityConfig implements GenericWizardEntityConfig<IPrcBoqExtendedEntity> {
	public entityConfig = PRC_CON_BOQ_ENTITY_CONFIG;
	public dataServiceType = ProcurementContractBoqDataService;
}