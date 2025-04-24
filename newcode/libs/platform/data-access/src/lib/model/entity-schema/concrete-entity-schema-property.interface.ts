/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySchemaStringProperty } from './entity-schema-string-property.interface';
import { IEntitySchemaSimpleProperty } from './entity-schema-simple-property.interface';

/**
 * Represents a strongly-typed property in an entity type.
 */
export type IConcreteEntitySchemaProperty =
	IEntitySchemaStringProperty |
	IEntitySchemaSimpleProperty;