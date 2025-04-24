/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityFilterOperator } from '../enums';
import { Translatable } from '@libs/platform/common';

/**
 * Interface representing an entity filter domain option.
 */
export interface IEntityFilterDomainOption {
	/**
	 * The unique identifier of the domain option.
	 */
	id: string;

	/**
	 * The operator used for the domain option.
	 */
	operator: EntityFilterOperator;

	/**
	 * The label of the domain option, which can be translated.
	 */
	label: Translatable;
}
