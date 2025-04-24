/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * In some case, it will set 0 to foreign key field to identify it is empty
 * not sure why, but it should be avoided, currently use this type to trace all usage, maybe refactor related code in future
 */
export const EmptyFk = 0;

export const UninitializedFk = -1;

export function isEmptyFk(value: unknown): boolean {
	return [null, undefined, EmptyFk].some((e) => e === value);
}

export function isUninitializedFk(value: unknown): boolean {
	return [null, undefined, UninitializedFk].some((e) => e === value);
}

export function isEmptyOrUninitializedFk(value: unknown): boolean {
	return [null, undefined, EmptyFk, UninitializedFk].some((e) => e === value);
}
