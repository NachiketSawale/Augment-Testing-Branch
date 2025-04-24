/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken, ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {
    SalesContractPaymentScheduleDataServiceInterface
} from './interface/sales-contract-payment-schedule-data-service.interface';
import { IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

/**
 * Procurement common payment schedule header information interface
 */
export interface SalesSharedPaymentScheduleHeaderInfo<T extends IOrdPaymentScheduleEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
    readonly dataServiceToken: ProviderToken<SalesContractPaymentScheduleDataServiceInterface<T, PT, PU>>;
}

/**
 * Injection token of payment schedule header info
 */
export const SalesSharedPaymentScheduleHeaderInfoToken = new InjectionToken<SalesSharedPaymentScheduleHeaderInfo<IOrdPaymentScheduleEntity, IEntityIdentification, CompleteIdentification<IEntityIdentification>>>('sales-contract-payment-schedule-header-info');