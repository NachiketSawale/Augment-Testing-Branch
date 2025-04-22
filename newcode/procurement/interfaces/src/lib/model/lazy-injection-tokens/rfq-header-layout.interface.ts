/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { IRfqHeaderEntity } from '../entities/rfq-header-entity.interface';
import { LazyInjectionToken } from '@libs/platform/common';

/**
 * Describes the service used to generate layouts for the rfq header container.
 */
export interface IProcurementRfqHeaderLayoutService {
    /**
     * Generates the layout for rfq header entity.
     */
    generateLayout(): ILayoutConfiguration<IRfqHeaderEntity>;
}

/**
 * Lazy injection token used to import rfq header layout service.
 */
export const RFQ_HEADER_LAYOUT_SERVICE = new LazyInjectionToken<IProcurementRfqHeaderLayoutService>('procurement-rfq-layout-service');