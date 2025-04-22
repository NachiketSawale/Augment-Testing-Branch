/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { IContactEntity } from '../entities/contact';

/**
 * Updated business partners with external user data.
 */
export interface IRfqBusinessPartnerMainPortalUserManagementService {

    /**
     * Maps external user details for contacts.
     * @param contacts 
     */
    getAndMapProviderInfo(contacts: IContactEntity[]): Promise<IContactEntity[]>;
}

/**
 * Lazy injection token to use BusinessPartnerMainPortalUserManagementService.
 */
export const RFQ_BPM_PORTAL_USER_MANAGEMENT_SERVICE = new LazyInjectionToken<IRfqBusinessPartnerMainPortalUserManagementService>('rfq-business-partner-main-portal-user-management-service');