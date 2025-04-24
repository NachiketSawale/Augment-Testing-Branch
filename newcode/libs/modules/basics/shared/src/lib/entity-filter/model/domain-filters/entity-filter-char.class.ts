/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityFilterDomain } from '../interfaces';
import { FieldType } from '@libs/ui/common';
import { EntityFilterOperator } from '../enums';

export const ENTITY_FILTER_CHAR: IEntityFilterDomain<string> = {
	type: FieldType.Description,
	options: [
		{
			id: 'startsWith',
			operator: EntityFilterOperator.StartsWith,
			label: 'basics.material.lookup.condition.startsWith',
		},
		{
			id: 'contains',
			operator: EntityFilterOperator.Contains,
			label: 'basics.material.lookup.condition.contains',
		},
		{
			id: 'endsWith',
			operator: EntityFilterOperator.EndsWith,
			label: 'basics.material.lookup.condition.endsWith',
		},
	],
};
