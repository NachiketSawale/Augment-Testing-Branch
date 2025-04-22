/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IRfqBusinessPartnerEntity } from '../entities/rfq-businesspartner-entity.interface';

/**
 * To get the layout configuration for businesspartner of contract confirm wizard
 */
export interface IContractBusinesspartnerLayout {
	generateLayout(): Promise<ILayoutConfiguration<IRfqBusinessPartnerEntity>>

}

export const CONTRACT_CONFIRM_BUSINESS_PARTNER_LAYOUT_SERVICE = new LazyInjectionToken<IContractBusinesspartnerLayout>('con-confirm-business-partner-layout');

