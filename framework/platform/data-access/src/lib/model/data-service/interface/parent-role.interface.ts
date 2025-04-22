/*
 * Copyright(c) RIB Software GmbH
 */

import { IParentRoleBase } from './parent-role-base.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IChildRoleBase } from './child-role-base.interface';
import { Subject } from 'rxjs';

/**
 * Typed interface for the parent role. Used for the internal access of the parent role functionality
 * @typeParam T - entity type handled by the data service
 * @typeParam U - complete entity for update of own entities and subordinated entities
 */
export interface IParentRole<T extends object, U extends CompleteIdentification<T>> extends IParentRoleBase {
	/**
	 * Function to register a subordinated (child) data service. The registered service should be taken into account in
	 * loading and updating triggered by the parent or even higher levels.
	 * @param childService The child data service that needs to be administered by the parent service
	 */
	registerChildService(childService: IChildRoleBase<T, U>): void;

	/**
	 *
	 */
	childrenHaveModification(parent: T): boolean;

	/**
	 * Function for triggering the load calls in all subordinated (child) data services
	 * @param selected The currently selected parent entity. May be null, in case a deselction has taken place
	 */
	loadChildEntities(selected: T): Promise<T | null>

	/**
	 * Passes the own update entity to all subordinated data services
	 @param complete A container for all data to be saved or deleted
	 @param forEntity The parent entity for which the complete is created
	 */
	collectChildModifications(complete: U, forEntity: T): void

	/**
	 * Writes back the updated entities sent back from the application server
	 */
	takeOverUpdatedChildEntities(updated: U): void

	/**
	 * Clear the modification information of subordinated data services
	 */
	clearChildrenModification(): void

	/**
	 * Info about entities in the root chain have been modified
	 */
	entitiesModifiedInfo: Subject<void>
}
