/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { Translatable } from '@libs/platform/common';

/**
 * Interface representing the extension of an entity filter search field.
 */
export interface IEntityFilterSearchFieldExtension {
	/**
	 * Determines if search fields are shown.
	 *
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if search fields are shown.
	 */
	isShownSearchFields(): Promise<boolean>;

	/**
	 * Provides the search fields.
	 *
	 * @returns {Promise<IEntityFilterSearchField[]>} A promise that resolves to an array of search fields.
	 */
	provideSearchFields(): Promise<IEntityFilterSearchField[]>;

	/**
	 * Loads the configuration of the search field.
	 *
	 * @returns {Promise<IEntityFilterSearchFieldConfig>} A promise that resolves to the configuration of the search field.
	 */
	loadSearchFieldConfig(): Promise<IEntityFilterSearchFieldConfig>;

	/**
	 * Saves the configuration of the search field.
	 *
	 * @param {IEntityFilterSearchFieldConfig} config - The configuration of the search field to save.
	 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the configuration was saved successfully.
	 */
	saveSearchFieldConfig(config: IEntityFilterSearchFieldConfig): Promise<boolean>;
}

/**
 * Type representing the identifier of an entity filter search field.
 * It can be either a number or a string.
 */
export type EntityFilterSearchFieldId = number | string;

/**
 * Interface representing an entity filter search field.
 */
export interface IEntityFilterSearchField {
	/**
	 * The unique identifier of the search field.
	 *
	 * @type {EntityFilterSearchFieldId}
	 */
	id: EntityFilterSearchFieldId;

	/**
	 * The description of the search field.
	 *
	 * @type {Translatable}
	 */
	description: Translatable;

	/**
	 * Indicates if the search field is selected.
	 *
	 * @type {boolean}
	 * @optional
	 */
	selected?: boolean;

	/**
	 * Indicates if the search field is "All" field.
	 *
	 * @type {boolean}
	 * @optional
	 */
	isAll?: boolean;
}

/**
 * Interface representing the configuration of an entity filter search field.
 */
export interface IEntityFilterSearchFieldConfig {
	/**
	 * An array of identifiers for the search fields.
	 *
	 * @type {EntityFilterSearchFieldId[]}
	 */
	ids: EntityFilterSearchFieldId[];
}

/**
 * The injection token
 */
export const ENTITY_FILTER_SEARCH_FIELD_EXTENSION = new InjectionToken<IEntityFilterSearchFieldExtension>('ENTITY_FILTER_SEARCH_FIELD_EXTENSION');
