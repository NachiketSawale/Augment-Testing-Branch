/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Maintains readonly state for one data item
 */
export type ReadonlyState<T> = {
	[p in keyof T]?: boolean;
};

/**
 * Readonly info for certain field
 */
export type ReadonlyInfo<T> = {
	item: T;
	field: string;
	state: ReadonlyState<T>;
};

/**
 * Readonly function
 * Note: Undefined means that it will not affect previous readonly state
 */
export type ReadonlyFunction<T> = (info: ReadonlyInfo<T>) => boolean | undefined;

/**
 * Async readonly function
 */
export type AsyncReadonlyFunction<T> = (info: ReadonlyInfo<T>) => Promise<boolean | undefined>;

/**
 * Shared readonly function base
 */
export type SharedReadonlyFunctionBase<T> = {
	/**
	 * other fields share with readonly function with current field
	 */
	shared: (keyof T)[];
	/**
	 * Make the other remaining fields has opposite readonly state
	 */
	makeOthersOpposite?: boolean;
};

/**
 * Shared readonly function
 */
export type SharedReadonlyFunction<T> = SharedReadonlyFunctionBase<T> & {
	/**
	 * readonly function
	 */
	readonly: ReadonlyFunction<T>;
};

/**
 * Shared readonly function
 */
export type AsyncSharedReadonlyFunction<T> = SharedReadonlyFunctionBase<T> & {
	/**
	 * Async readonly function
	 */
	readonly: AsyncReadonlyFunction<T>;
};

/**
 * Readonly function for every necessary field of T
 */
export type ReadonlyFunctions<T> = {
	[p in keyof T]?: ReadonlyFunction<T> | SharedReadonlyFunction<T>;
};

/**
 * Async readonly function for every necessary field of T
 */
export type AsyncReadonlyFunctions<T> = {
	[p in keyof T]?: AsyncReadonlyFunction<T> | AsyncSharedReadonlyFunction<T>;
};

/**
 * Readonly functions generator
 */
export interface IReadonlyFunctionsGenerator<T> {
	generateReadonlyFunctions(): ReadonlyFunctions<T>;
}

/**
 * Async readonly functions generator
 */
export interface IAsyncReadonlyFunctionsGenerator<T> extends IReadonlyFunctionsGenerator<T> {
	generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<T>;
}

/**
 * Async readonly status
 */
export enum AsyncReadonlyStatus {
	Working,
	Success,
	Failed,
}
