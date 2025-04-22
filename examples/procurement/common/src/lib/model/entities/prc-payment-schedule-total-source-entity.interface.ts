/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

/**
 * Procurement common payment schedule total source entity interface
 */
export interface IPrcCommonPaymentScheduleTotalSourceEntity extends IPrcCommonTotalEntity {
	TypeCode?: string;
	TypeDescription?: string;
}

/**
 * Procurement common payment schedule total source context entity
 */
export interface IPrcCommonPaymentScheduleTotalSourceContextEntity {
	ParentConfigurationFk?: number,
	ParentId?: number,
	VatPercent: number,
	SourceNetOc: number,
	SourceGrossOc: number,
	Url: string
}

/**
 * Injection token of procurement common payment schedule context entity
 */
export const PRC_PAYMENT_SCHEDULE_TOTAL_SOURCE_CONTEXT_ENTITY = new InjectionToken<IPrcCommonPaymentScheduleTotalSourceContextEntity>('PRC_PAYMENT_SCHEDULE_TOTAL_SOURCE_CONTEXT_ENTITY');