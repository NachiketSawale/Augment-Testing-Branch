/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 * Interface for Estimate Main Root Assignment container
 */

export interface IEstRootAssignmentData extends IEntityBase {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * EstHeaderFk
	 */
	EstHeaderFk?: number | null;

	/**
	 * Estimate
	 */
	Estimate?: string;

	/**
	 * Rule
	 */
	Rule?: [];

	/**
	 * Param
	 */
	Param?: [];

	/**
	 * IsEstHeaderRoot
	 */
	IsEstHeaderRoot?: boolean;
}
