/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityFilterAccessLevel } from '../enums';
import { IEntityFilterExpression } from './entity-filter-expression.interface';

/**
 * Interface representing an entity filter profile entity.
 */
export interface IEntityFilterProfileEntity {
	FilterName: string;
	AccessLevel: EntityFilterAccessLevel;
	FilterValue: {
		Filters: IEntityFilterExpression[];
	};
	IsNew?: boolean;
}
