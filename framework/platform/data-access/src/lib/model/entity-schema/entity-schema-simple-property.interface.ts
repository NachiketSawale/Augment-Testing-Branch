/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySchemaProperty } from './entity-schema-property.interface';
import { EntityDomainType, StringDomainType } from './entity-domain-type.enum';
import { isEntitySchemaStringProperty } from './entity-schema-string-property.interface';

type SimpleDomainType = Exclude<EntityDomainType, StringDomainType>;

/**
 * The interface for properties without any options.
 */
export interface IEntitySchemaSimpleProperty extends IEntitySchemaProperty {

	/**
	 * The domain type of the property.
	 */
	readonly domain: SimpleDomainType;
}

/**
 * A typeguard to identify {@link IEntitySchemaSimpleProperty}.
 * @param {IEntitySchemaProperty} v The value to check.
 */
export function isEntitySchemaSimpleProperty(v?: IEntitySchemaProperty): v is IEntitySchemaSimpleProperty {
	return !isEntitySchemaStringProperty(v);
}