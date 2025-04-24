/*
 * Copyright(c) RIB Software GmbH
 */

import {IPrcItemEntity} from '@libs/procurement/common';

/**
 * Contract item dto
 */
export interface IConItemEntity extends IPrcItemEntity {
	// todo - fix lint error that interface must define a member
	ConHeaderFk?: number;

	// todo - please add more meaningful comment after understand the business
	hasPreviousParent?: boolean;

	RemainingQuantityForCallOff: number;
}