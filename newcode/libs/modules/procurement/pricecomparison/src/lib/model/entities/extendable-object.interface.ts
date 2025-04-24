/*
 * Copyright(c) RIB Software GmbH
 */

export interface IExtendableObject<T = unknown> {
	[p: string]: T;
}