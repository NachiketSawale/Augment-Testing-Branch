/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityDomainType } from './entity-domain-type.enum';

/**
 * The base type for individual properties in an entity schema.
 */
export interface IEntitySchemaProperty {

	/**
	 * Indicates the data type of the property.
	 */
	readonly domain: EntityDomainType;

	/**
	 * Indicates whether the field is mandatory.
	 */
	readonly mandatory: boolean;
}