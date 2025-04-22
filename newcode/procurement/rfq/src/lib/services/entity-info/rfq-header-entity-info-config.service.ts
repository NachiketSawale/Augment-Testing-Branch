/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { PRC_RFQ_ENTITY_CONFIG, IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RFQ_HEADER_ENTITY_CONFIG } from '../../model/classes/rfq-header-entity-config.class';
import { ProcurementRfqHeaderMainDataService } from '../procurement-rfq-header-main-data.service';
import { GenericWizardRootEntityConfig } from '@libs/ui/business-base';

/**
 * Lazy service used to retrieve the entity configuration information for rfq header.
 */
@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: PRC_RFQ_ENTITY_CONFIG,
	useAngularInjection: true
})
export class RfqHeaderEntityConfig implements GenericWizardRootEntityConfig<IRfqHeaderEntity> {
	public entityConfig = RFQ_HEADER_ENTITY_CONFIG;

	public rootDataServiceType = ProcurementRfqHeaderMainDataService;
}