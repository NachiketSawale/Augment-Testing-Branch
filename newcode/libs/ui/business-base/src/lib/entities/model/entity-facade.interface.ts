/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';

/**
 * Provides functions to access and update items in the current entity.
 */
export interface IEntityFacade {
	/**
	 * The corresponding id of the entity facade.
	 */
	entityFacadeId?: string;

	/**
	 * Retrieve the current selected id or, in case of multiple selections, the first selected id.
	 * If nothing is selected, return undefined.
	 * @returns The selected id against this entity.
	 */
	getSelectedId: () => IIdentificationData | null;

	/**
	 * Retrieve all selected ids.
	 * If nothing is selected, return an empty array.
	 * @returns An array of selected ids against this entity.
	 */
	getSelectedIds: () => IIdentificationData[];

	/**
	 * Retrieve all ids in the list.
	 * If there are no loaded entities, return an empty array.
	 * @returns An array of ids currently loaded in the entity.
	 */
	getAllIds: () => IIdentificationData[];
}