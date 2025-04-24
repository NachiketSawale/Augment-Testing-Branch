/*
 * Copyright(c) RIB Software GmbH
 */

import { MaterialSearchSort } from '../../../material-search';

/**
 * The constant represents Material filter lookup sort by items information
 */
export const MaterialFilterSortByItems = [
	{id: MaterialSearchSort.SupplierAscending, caption: {key: 'basics.material.lookup.SupplierAscending'}},
	{id: MaterialSearchSort.SupplierDescending, caption: {key: 'basics.material.lookup.SupplierDescending'}},
	{id: MaterialSearchSort.CodeAscending, caption: {key: 'basics.material.lookup.CodeAscending'}},
	{id: MaterialSearchSort.CodeDescending, caption: {key: 'basics.material.lookup.CodeDescending'}},
	{id: MaterialSearchSort.PriceAscending, caption: {key: 'basics.material.lookup.PriceAscending'}},
	{id: MaterialSearchSort.PriceDescending, caption: {key: 'basics.material.lookup.PriceDescending'}},
];