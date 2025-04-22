/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Filter Script Validation Error Entity
 */

export interface IFilterScriptLintValidationError {
	id: string,
	raw: string,
	evidence: string,
	line: number,
	from: number,
	to: number,
	character: number,
	a?: string,
	b?: string | number,
	c?: string | number,
	d?: string | number,
	severity : 'info' | 'warning' | 'error',
	reason?: string
}