/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { ICertificateEntity } from '../entities/certificate';
import { LazyInjectionToken } from '@libs/platform/common';

/**
 * Describes the business partner certificate layout service.
 */
export interface IBusinessPartnerCertificateLayout {
    /**
     * Generates the layout for business partner certificate container.
     */
    generateLayout(): ILayoutConfiguration<ICertificateEntity>;
}

/**
 * Token used to inject business partner layout service.
 */
export const BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN = new LazyInjectionToken<IBusinessPartnerCertificateLayout>('business-partner-certificate-layout-service');