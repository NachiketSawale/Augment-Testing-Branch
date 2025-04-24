/*
 * Copyright(c) RIB Software GmbH
 */

import { GenericWizardEntityConfig } from '@libs/ui/business-base';
import { IRfqBusinessPartnerEntity } from '../entities/rfq-businesspartner-entity.interface';
import { LazyInjectionToken } from '@libs/platform/common';


/**
 * Gets a lazy injection token for the RFQ Bidder entity configuration.
 * @returns a lazy injection token for the RFQ Bidder entity configuration.
 */
export function getRfqBidderConfig() {
	return new LazyInjectionToken<GenericWizardEntityConfig<IRfqBusinessPartnerEntity>>('prc-rfq-bidder-entity-config');
}

/**
 * Represents the entity configuration for RFQ Bidder.
 */
export const PRC_RFQ_BIDDER_ENTITY_CONFIG = getRfqBidderConfig();