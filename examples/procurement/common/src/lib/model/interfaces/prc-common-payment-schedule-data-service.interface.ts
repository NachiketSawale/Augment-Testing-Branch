/*
 * Copyright(c) RIB Software GmbH
 */

import { IPaymentScheduleBaseEntity } from '@libs/basics/interfaces';
import { IPrcHeaderDataService } from './prc-header-data-service.interface';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IBasicsSharedPaymentScheduleDataServiceInterface } from '@libs/basics/shared';

/**
 * Payment schedule basics data service interface
 */
export interface IPrcCommonPaymentScheduleDataServiceInterface<
	T extends IPaymentScheduleBaseEntity,
	PT extends IEntityIdentification,
	PU extends CompleteIdentification<PT>>
	extends IBasicsSharedPaymentScheduleDataServiceInterface<T, PT, PU> {

	/**
	 * Total source data url
	 */
	totalSourceUrl: string

	/**
	 * Parent data service
	 */
	parentService: IPrcHeaderDataService<PT, PU>
}