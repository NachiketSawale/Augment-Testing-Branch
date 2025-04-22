/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { IContactEntity } from '../entities/contact/contact-entity.interface';
import { ContactConditionKeyEnum } from '../enum/contact-condition-key.enum';

/**
 * Represents the business partner layout service.
 */
export interface IBusinessPartnerHelperProvider {
    /**
     * Generates the layout configuration for business partner layout service.
     */
    getDefaultContactByBranch(contactConditionKeyEnum:ContactConditionKeyEnum,businessPartnerFk?: number|null, branchFk?: number|null): Promise<IContactEntity|null>
}

/**
 * Lazy injection token to use business partner layout service.
 */
export const BUSINESS_PARTNER_HELPER_TOKEN = new LazyInjectionToken<IBusinessPartnerHelperProvider>('business-partner-helper-provider');