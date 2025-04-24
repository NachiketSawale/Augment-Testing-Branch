/*
 * Copyright(c) RIB Software GmbH
 */

import { IRootRole } from '../interface/root-role.interface';
import { EntitySelection } from './entity-selection.class';
import { CompleteIdentification } from '@libs/platform/common';
import { IEntityList } from '../interface/entity-list.interface';
import { IIdentificationDataConverter } from '../interface/identification-data-converter.interface';


/**
 * Base class of all data service classes for non hierarchically entity classes being the main
 * entity in the business module. The service will be linked to sidebar, navigation bar, ...
 * @typeParam T - entity type handled by the data service
 * @typeParam U - complete entity for update of own entities and subordinated entities
 */
export class RootEntitySelection<T extends object, U extends CompleteIdentification<T>> extends EntitySelection<T> {
	/**
	 * Constructor
	 * @param rootRole - access to the role, necesary to trigger update handling before the selection change is done
	 * @param entityList - entity list, necessary in base to implement selectFirst ...
	 * @param converter helper class used to convert entity to IdentificationData
	 */
	public constructor(protected rootRole: IRootRole<T, U>, entityList: IEntityList<T>, converter: IIdentificationDataConverter<T>) {
		super(entityList, converter);
	}

	/**
	 * Load entities for given identification data
	 * @param oldSelection Information about the old selection
	 * @param newSelection Information about the new selection
	 */
	public override prepareSelectionChange(oldSelection: T | null, newSelection: T | null): Promise<T | null> {
		if(oldSelection){
			return this.rootRole.update(oldSelection);
		}
		return super.prepareSelectionChange(oldSelection,newSelection);
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
		return this.rootRole.loadChildEntities(newSelection);
	}
}
