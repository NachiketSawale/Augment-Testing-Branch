/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from '@libs/estimate/interfaces';

export interface IEstimateScope  {
	estimateScope?: number;
	EstLineItems? :IEstLineItemEntity[]
}