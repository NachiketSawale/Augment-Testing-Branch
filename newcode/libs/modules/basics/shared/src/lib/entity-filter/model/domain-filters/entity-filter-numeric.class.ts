/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityFilterDomain } from '../interfaces';
import { FieldType } from '@libs/ui/common';
import { EntityFilterOperator } from '../enums';

export const ENTITY_FILTER_NUMERIC: IEntityFilterDomain<number> = {
	type: FieldType.Decimal,
	options: [
		{
			id: 'equals',
			operator: EntityFilterOperator.Equals,
			label: 'basics.material.lookup.condition.equals',
		},
		{
			id: 'lessThan',
			operator: EntityFilterOperator.LessThan,
			label: 'basics.material.lookup.condition.lessThan',
		},
		{
			id: 'greaterThan',
			operator: EntityFilterOperator.GreaterThan,
			label: 'basics.material.lookup.condition.greaterThan',
		},
		{
			id: 'range',
			operator: EntityFilterOperator.Range,
			label: 'basics.material.lookup.condition.range',
		},
	],
	comparer: (a, b) => {
		return a - b;
	},
	rangeErrors: {
		min: 'basics.material.lookup.filter.rangeValidation.min',
		max: 'basics.material.lookup.filter.rangeValidation.max',
		identical: 'basics.material.lookup.filter.rangeValidation.identical',
	},
};
