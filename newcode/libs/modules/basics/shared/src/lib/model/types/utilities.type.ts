/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents JSON data object type
 */
export type JObject<T = unknown> = {
	[key: string]: T
}