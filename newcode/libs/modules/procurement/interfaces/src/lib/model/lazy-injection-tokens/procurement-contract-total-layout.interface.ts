/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { IPrcCommonTotalEntity } from '../entities/prccommon';
import { CompleteIdentification, LazyInjectionToken } from '@libs/platform/common';
import { IEntityList, IEntitySelection, IParentRole } from '@libs/platform/data-access';

/**
 * Defines the layout for procurement contract total layout service.
 */
export interface IPrcContractTotalsLayoutService {
    /**
     * Generates layout for procurement contract total container.
     */
    generateLayout<T extends object, U extends CompleteIdentification<T>>(parentService: IParentRole<T, U> & IEntitySelection<T> & IEntityList<T>): Promise<ILayoutConfiguration<IPrcCommonTotalEntity>>;
}

/**
 * Injection token that is used to inject contract total layout service.
 */
export const PRC_CONTRACT_TOTAL_LAYOUT_SERVICE_TOKEN = new LazyInjectionToken<IPrcContractTotalsLayoutService>('prc-contract-total-layout-service');