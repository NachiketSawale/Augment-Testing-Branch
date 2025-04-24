/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectable } from '@libs/platform/common';
import { PRC_RFQ_BIDDER_ENTITY_CONFIG, IRfqBusinessPartnerEntity } from '@libs/procurement/interfaces';
import { RFQ_BUSINESS_PARTNER_ENTITY_INFO_CONFIG } from '../../model/classes/rfq-bidder-entity-config.class';
import { ProcurementRfqBusinessPartnerDataService } from '../rfq-business-partner-data.service';
import { GenericWizardEntityConfig } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
/**
 * Lazy service used to retrieve the entity configuration information for rfq bidder.
 */
@LazyInjectable({
	token: PRC_RFQ_BIDDER_ENTITY_CONFIG,
	useAngularInjection: true
})
export class RfqBidderEntityConfig implements GenericWizardEntityConfig<IRfqBusinessPartnerEntity> {
	public entityConfig = RFQ_BUSINESS_PARTNER_ENTITY_INFO_CONFIG;

	public dataServiceType = ProcurementRfqBusinessPartnerDataService;
}