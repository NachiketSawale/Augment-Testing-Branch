/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityFilterExpression } from './entity-filter-expression.interface';
import { EntityFilterOperator } from '../enums';
import { IEntityFilterListItem } from './entity-filter-list-item.interface';
import { IEntityFilterEndpoint } from './entity-filter-endpoint.interface';
import { InjectionToken } from '@angular/core';

/**
 * Interface representing an entity filter definition.
 */
export interface IEntityFilterDefinition extends IEntityFilterExpression {
	/** Is pinned in the top position */
	IsPinned?: boolean;

	/** Allowed operators */
	AllowedOperators?: EntityFilterOperator[];

	/** The available list for list filter */
	List?: IEntityFilterListItem[];

	/** The predefined list */
	PredefinedList?: IEntityFilterListItem[];

	/** The list endpoint definition */
	ListEndpoint?: IEntityFilterEndpoint;

	/** The items endpoint definition, get items by specified ids for formatting */
	ItemsEndpoint?: IEntityFilterEndpoint;

	/** The property name from target entity if it exists */
	PropertyName?: string;

	/** The display items for foreign key factors */
	DisplayItems?: IEntityFilterListItem[];

	/** The factors for which the display items are loading */
	LoadingFactors?: unknown[];
}

/**
 * Injection token for entity filter definition
 */
export const ENTITY_FILTER_DEFINITION = new InjectionToken<IEntityFilterDefinition>('ENTITY_FILTER_DEFINITION');
