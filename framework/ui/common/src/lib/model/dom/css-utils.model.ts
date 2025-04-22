/*
 * Copyright(c) RIB Software GmbH
 */

const okPattern = /[A-Za-z0-9]+/g;

/**
 * Generates a CSS class name that can be used to identify elements in the UI.
 * Such classes may be safely used by UI automation tools.
 *
 * @param name The raw name of the class.
 *
 * @return The CSS class name.
 */
export function uiAutomationIdentifierClass(name: string): string {
	let result = 'ui';
	for (const match of name.matchAll(okPattern)) {
		result += '-' + match[0].toLowerCase();
	}
	return result;
}
