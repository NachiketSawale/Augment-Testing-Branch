/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { IPrcCertificateEntity } from '../entities/prc-certificate-entity.interface';
import { ILayoutConfiguration } from '@libs/ui/common';

/**
 * Describes the service that generates the layout for procurement common certificate container.
 */
export interface IPrcCommonCertificateLayout {
    /**
     * Prepares the layout for procurement common certificate container.
     */
    generateLayout<T extends IPrcCertificateEntity>(): Promise<ILayoutConfiguration<T>>;
}

/**
 * Lazy injection token used to inject procurement common layout service.
 */
export const PRC_COMMON_CERTIFICATE_LAYOUT_SERVICE_TOKEN = new LazyInjectionToken<IPrcCommonCertificateLayout>('procurement-common-certificate-layout-service');