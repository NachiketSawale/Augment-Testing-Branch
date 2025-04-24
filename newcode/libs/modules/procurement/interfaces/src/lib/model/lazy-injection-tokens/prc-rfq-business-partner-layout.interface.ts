/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { IRfqBusinessPartnerEntity } from '../entities/rfq-businesspartner-entity.interface';
import { ILayoutConfiguration } from '@libs/ui/common';


/**
 * Represents the entity configuration for RFQ business partner layout service.
 */
export const PRC_RFQ_BUSINESS_PARTNER_LAYOUT_SERVICE = new LazyInjectionToken<IRfqBusinessPartnerLayoutConfiguration>('prc-rfq-business-partner-layout');

export interface IRfqBusinessPartnerLayoutConfiguration {
	/**
	 * Generates layout for business partner container.
	 */
	generateLayout(): Promise<ILayoutConfiguration<IRfqBusinessPartnerEntity>>
}