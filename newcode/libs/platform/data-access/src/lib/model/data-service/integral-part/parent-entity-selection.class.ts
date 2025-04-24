/*
 * Copyright(c) RIB Software GmbH
 */

import { IParentRole } from '../interface/parent-role.interface';
import { EntitySelection } from './entity-selection.class';
import { CompleteIdentification } from '@libs/platform/common';
import { IEntityList } from '../interface/entity-list.interface';
import { IIdentificationDataConverter } from '../interface/identification-data-converter.interface';

/**
 * Class for selection handling in services having subordinated data services
 * @typeParam T - entity type handled by the data service
 * @typeParam U - complete entity for update of own entities and subordinated entities
 */
export class ParentEntitySelection<T extends object, U extends CompleteIdentification<T>> extends EntitySelection<T> {
	/**
	 * The constructor of the parent entity selection. Provides the necessary finish of a selection
	 * change on a root or node level
	 * @param parentRole - access to our role
	 * @param entityList - entity list for access of entities in selection methods
	 * @param converter helper class used to convert entity to IdentificationData
	 */
	public constructor(protected parentRole: IParentRole<T, U>, entityList: IEntityList<T>, converter: IIdentificationDataConverter<T>) {
		super(entityList, converter);
	}

	/**
	 * Load entities for given identification data
	 * @param oldSelection Information about the old selection
	 * @param newSelection Information about the new selection
	 */
	public override finishSelectionChange(oldSelection: T | null, newSelection: T | null): Promise<T | null> {
		if(newSelection === null){
			return Promise.resolve(null);
		}
		return this.parentRole.loadChildEntities(newSelection);
	}
}
