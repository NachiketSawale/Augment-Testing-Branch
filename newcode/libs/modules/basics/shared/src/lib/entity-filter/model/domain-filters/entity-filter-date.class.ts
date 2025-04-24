/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityFilterDomain } from '../interfaces';
import { FieldType } from '@libs/ui/common';
import { EntityFilterOperator } from '../enums';

export const ENTITY_FILTER_DATE: IEntityFilterDomain<Date> = {
	type: FieldType.DateUtc,
	options: [
		{
			id: 'on',
			operator: EntityFilterOperator.Equals,
			label: 'basics.material.lookup.condition.on',
		},
		{
			id: 'between',
			operator: EntityFilterOperator.Range,
			label: 'basics.material.lookup.condition.between',
		},
		{
			id: 'startingFrom',
			operator: EntityFilterOperator.GreaterThan,
			label: 'basics.material.lookup.condition.startingFrom',
		},
		{
			id: 'upTo',
			operator: EntityFilterOperator.LessThan,
			label: 'basics.material.lookup.condition.upTo',
		},
	],
	comparer: (a, b) => {
		if (a > b) {
			return 1;
		}

		if (a < b) {
			return -1;
		}

		return 0;
	},
	rangeErrors: {
		min: 'basics.material.lookup.filter.rangeDateValidation.min',
		max: 'basics.material.lookup.filter.rangeDateValidation.max',
		identical: 'basics.material.lookup.filter.rangeDateValidation.identical',
	},
};
