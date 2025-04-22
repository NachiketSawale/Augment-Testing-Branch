/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { IBusinessPartnerEntity } from '../entities/main';
import { LazyInjectionToken } from '@libs/platform/common';

/**
 * Represents the business partner layout service.
 */
export interface IBusinessPartnerLayoutService {
    /**
     * Generates the layout configuration for business partner layout service.
     */
    generateLayout(): Promise<ILayoutConfiguration<IBusinessPartnerEntity>>
}

/**
 * Lazy injection token to use business partner layout service.
 */
export const BUSINESS_PARTNER_LAYOUT_SERVICE_TOKEN = new LazyInjectionToken<IBusinessPartnerLayoutService>('IBusinessPartnerLayoutService');