/*
 * Copyright(c) RIB Software GmbH
 */

import {IEstLineItemEntity} from '@libs/estimate/interfaces';

export interface IPackageEstimateLineItemEntity extends IEstLineItemEntity {
	Rule?: string;
	Param?: string;
	BoqRootRef?: string;
	PsdActivitySchedule?: string;
	statusImage?: string;
}