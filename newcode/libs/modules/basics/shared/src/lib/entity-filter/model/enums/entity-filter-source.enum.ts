/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Enum representing the source of entity filter.
 */
export enum EntityFilterSource {
	/** Custom filter */
	Custom = 0,

	/** From entity column */
	Entity = 1,

	/** From entity attribute */
	Attribute = 2,
}