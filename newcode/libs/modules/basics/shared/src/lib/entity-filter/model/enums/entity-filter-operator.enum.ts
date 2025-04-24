/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Enum representing the operator for entity filter.
 */
export enum EntityFilterOperator {
	/** e.g. CatalogFk=1 or CatalogFk in (1, 2, 3) */
	Equals = 1,

	/** e.g. Price less than 100 */
	LessThan = 2,

	/** e.g. Price greater than 100 */
	GreaterThan = 3,

	/** Range, e.g. Price between 100 and 300 */
	Range = 4,

	/** e.g. Code like '%test%' */
	Contains = 5,

	/** e.g. Code like 'test%' */
	StartsWith = 6,

	/** e.g. Code like '%test' */
	EndsWith = 7,
}