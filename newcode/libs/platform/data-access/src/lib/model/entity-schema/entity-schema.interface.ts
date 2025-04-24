/*
 * Copyright(c) RIB Software GmbH
 */

import { IConcreteEntitySchemaProperty } from './concrete-entity-schema-property.interface';
import { AllKeys, ValueOrType } from '@libs/platform/common';
import { Type } from '@angular/core';

/**
 * Contains schema information for an entity type.
 *
 * `IEntitySchema` represents an object that contains meta-data on the properties of a given entity type `T`.
 * The entity type is specified as a generic argument for the interface.
 *
 * The interface can contain a block of schema information for each property of `T`.
 * As the interface is used to provide type-safe access to objects received from the back-end, all of its fields and all fields in its sub-interfaces are read-only.
 *
 * @typeParam T The entity type.
 *
 */
export interface IEntitySchema<T> {

	/**
	 * The name of the schema.
	 */
	readonly schema: string;

	/**
	 * The individual properties of the entity type.
	 */
	readonly properties: {

		/**
		 * Provides information about a property of the entity type.
		 */
		readonly [key in keyof Partial<T>]: IConcreteEntitySchemaProperty;
	};

	/**
	 * The list of nested properties available for processing domain controls for this entity.
	 */
	readonly additionalProperties?: {
		readonly [key in AllKeys<T>]?: IConcreteEntitySchemaProperty;
	}

	/**
	 * Defines the main module this entity schema belongs to.
	 */
	mainModule?: string;
}

/**
 * Checks whether a given entity schema or entity schema type is specified as a type.
 *
 * @typeParam T The entity type of the schema.
 *
 * @param s The value to check.
 *
 * @returns A value that indicates whether `s` is a type reference.
 */
export function isEntitySchemaType<T extends object>(s: ValueOrType<IEntitySchema<T>>): s is Type<IEntitySchema<T>> {
	if (typeof s === 'object') {
		return !(Object.prototype.hasOwnProperty.call(s, 'schema') && Object.prototype.hasOwnProperty.call(s, 'properties'));
	}

	return true;
}
