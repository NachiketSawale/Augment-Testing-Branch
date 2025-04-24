/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that defines common options for lookups.
 * It should be used as a base interface for lookup options objects meant to
 * configure specific lookups.
 */
export interface ICommonLookupOptions {

	/**
	 * If set to `true`, the lookup can be emptied by means of a *Clear* button.
	 */
	showClearButton?: boolean;
}
