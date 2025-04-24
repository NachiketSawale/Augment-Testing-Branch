/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken, ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcPaymentScheduleEntity } from '../entities';
import { IPrcCommonPaymentScheduleDataServiceInterface } from './prc-common-payment-schedule-data-service.interface';

/**
 * Procurement common payment schedule header information interface
 */
export interface IPrcCommonPaymentScheduleHeaderInfo<T extends IPrcPaymentScheduleEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
	readonly dataServiceToken: ProviderToken<IPrcCommonPaymentScheduleDataServiceInterface<T, PT, PU>>;
}

/**
 * Injection token of payment schedule header info
 */
export const PrcCommonPaymentScheduleHeaderInfoToken = new InjectionToken<IPrcCommonPaymentScheduleHeaderInfo<IPrcPaymentScheduleEntity, IEntityIdentification, CompleteIdentification<IEntityIdentification>>>('prc-common-payment-schedule-header-info');