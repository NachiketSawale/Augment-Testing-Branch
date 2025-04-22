/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySchemaProperty } from './entity-schema-property.interface';
import { isStringDomainType, StringDomainType } from './entity-domain-type.enum';

/**
 * The interface for string properties.
 */
export interface IEntitySchemaStringProperty extends IEntitySchemaProperty {

	/**
	 * Indicates the maximum length of the property value.
	 */
	readonly maxlen?: number;

	/**
	 * Indicates the maximum length of the property value as defined by the domain type.
	 */
	readonly domainmaxlen?: number;

	/**
	 * The domain type of the property.
	 */
	readonly domain: StringDomainType;
}

/**
 * A typeguard to identify {@link IEntitySchemaStringProperty}.
 * @param {IEntitySchemaProperty} v The value to check.
 */
export function isEntitySchemaStringProperty(v?: IEntitySchemaProperty): v is IEntitySchemaStringProperty {
	return Boolean(isStringDomainType(v?.domain));
}