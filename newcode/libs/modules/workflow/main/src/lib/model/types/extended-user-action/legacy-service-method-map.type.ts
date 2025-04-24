/*
 * Copyright(c) RIB Software GmbH
 */

import { Type } from '@angular/core';

/**
 * Contains untyped details about a legacy service and the methods it exposes.
 * This is build using the typed ServiceMethodMap and used only for communication with the iframe.
 */
export type ServiceFnArr = { legacyServiceName: string, methods: string[] }[];

/**
 * Contains typed details about a legacy service and the methods it exposes.
 */
export type ServiceMethodMap<T> = {
	Type: Type<T>,
	Methods: (KeysOfUnion<T>)[]
};

/**
 * Returns all the keys of a union type, as `keyof (union type)` always return an array of never.
 */
export type KeysOfUnion<T> = T extends T ? keyof T : never;