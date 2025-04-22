/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * This function return reandom genrated id
 * @returns random genrted id
 */
export function tableId() {
	const id = Math.random().toString(36).slice(2, 6);
	return `row-${id}`;
}
