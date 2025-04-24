/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { GenericWizardRootEntityConfig } from '@libs/ui/business-base';
import { ProcurementContractHeaderDataService } from '../procurement-contract-header-data.service';
import { PRC_CON_ENTITY_CONFIG } from '@libs/procurement/interfaces';
import { IConHeaderEntity } from '../../model/entities';
import { CON_HEADER_ENTITY_CONFIG } from '../../model/entity-info';

/**
 * A configuration class to provide entity configuration and relevant data service for "Contract Confirm Wizard".
 */
@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: PRC_CON_ENTITY_CONFIG,
	useAngularInjection: true
})
export class ConHeaderEntityConfig implements GenericWizardRootEntityConfig<IConHeaderEntity> {
	public entityConfig = CON_HEADER_ENTITY_CONFIG;

	public rootDataServiceType = ProcurementContractHeaderDataService;
}