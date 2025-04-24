/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Element value parser.
 */
export interface IUserFormElementValueParser {
	nameParser: (ele: HTMLElement) => string;
	get: (ele: HTMLElement) => ((ele: HTMLElement) => string | boolean | unknown) | undefined,
	parsers: {
		[key: string]: (ele: HTMLElement) => string | boolean | undefined | null
	},
	reset?: () => void
}