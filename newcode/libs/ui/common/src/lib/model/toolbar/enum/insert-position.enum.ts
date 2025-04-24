/*
 * Copyright(c) RIB Software GmbH
 */

/**
 *  For adding item into specific position.
 */
export enum InsertPosition {

	/**
	 * insert position before
	 */
	Before = 'before',

	/**
	 * insert position after
	 */
	After = 'after',

	/**
	 * The new items will replace the specified ones.
	 */
	Instead = 'instead'
}
