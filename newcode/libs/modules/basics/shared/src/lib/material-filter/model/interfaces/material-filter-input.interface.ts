/*
 * Copyright(c) RIB Software GmbH
 */

import { MaterialSearchSort, IMaterialTypeFilter } from '../../../material-search';
import { IEntityFilterInput } from '../../../entity-filter';

/**
 * Interface representing the input for material filtering.
 */
export interface IMaterialFilterInput extends IEntityFilterInput {
	/** Order by column */
	OrderBy?: MaterialSearchSort;

	/** Filter by material type */
	MaterialTypeFilter?: IMaterialTypeFilter;
}
