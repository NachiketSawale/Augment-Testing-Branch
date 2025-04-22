/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySelection } from '../interface/entity-selection.interface';
import { CollectionHelper, IIdentificationData } from '@libs/platform/common';
import { IEntityList } from '../interface/entity-list.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { IIdentificationDataConverter } from '../interface/identification-data-converter.interface';


/**
 * Class for managing selection (and multi selection) of entities
 * @typeParam T - entity type handled by the data service
 */
export class EntitySelection<T extends object> implements IEntitySelection<T> {
	protected selectedEntity: T | null = null;
	protected selectedEntities: T[] = [];
	protected readonly selectedEntities$ = new ReplaySubject<T[]>(1);

	/**
	 * Constructor
	 * @param entityList provides access to the current entity list.
	 * @param converter helper class used to convert entity to IdentificationData
	 */
	public constructor(protected entityList: IEntityList<T>, private converter: IIdentificationDataConverter<T>) {

	}

	public get selectionChanged$(): Observable<T[]> {
		return this.selectedEntities$;
	}

	/**
	 * Load entities for given identification data
	 * @param oldSelection Information about the old selection
	 * @param newSelection Information about the new selection
	 */
	protected prepareSelectionChange(oldSelection: T | null, newSelection: T | null): Promise<T | null> {
		return Promise.resolve(oldSelection);
	}

	/**
	 * Load entities for given identification data
	 * @param oldSelection Information about the old selection
	 * @param newSelection Information about the new selection
	 */
	protected finishSelectionChange(oldSelection: T | null, newSelection: T | null): Promise<T | null> {
		return Promise.resolve(newSelection);
	}

	/**
	 * Gets the current selection set
	 * @return all selected elements, in case of none selected, an empty array
	 */
	public getSelection(): T[] {
		return this.selectedEntities;
	}

	/**
	 * Gets the current selected ids in IIdentificationData format.
	 * @returns An array of identification data of selected items.
	 */
	public getSelectedIds(): IIdentificationData[] {
		const identificationIds: IIdentificationData[] = [];
		this.selectedEntities.forEach((element) => {
			const identificationId = this.converter.convert(element, true);
			if (identificationId !== null) {
				identificationIds.push(identificationId);
			}
		});
		return identificationIds;
	}

	/**
	 * Get the current selected entity
	 * @return the selected entity null in case none selected
	 */
	public getSelectedEntity(): T | null {
		return this.selectedEntity;
	}

	/**
	 * Checks if currenty at least one entity is selected
	 * @return true iff at least one element is selected
	 */
	public hasSelection(): boolean {
		return this.selectedEntity != null;
	}

	/**
	 * Selects the passed entities.
	 * @param toSelect
	 */
	public select(toSelect: T[] | T | null): Promise<T | null> {
		const toSelectAsArray: T[] = [];
		CollectionHelper.AppendTo(toSelect, toSelectAsArray);

		let newSelection: T | null = null;
		if (toSelectAsArray.length > 0) {
			newSelection = toSelectAsArray[0];
		}
		return this.prepareSelectionChange(this.selectedEntity, newSelection).then(() => {
			this.selectedEntities = toSelectAsArray;
			this.selectedEntity = newSelection;
			this.selectedEntities$.next(toSelectAsArray);
			return this.finishSelectionChange(this.selectedEntity, newSelection);
		});
	}

	/**
	 * Selects entities matching the passed ids.
	 * @param toSelect identifier (array) for the elements to select
	 */
	public selectById(toSelect: IIdentificationData[] | IIdentificationData | null): Promise<T | null> {
		return Promise.resolve(null);
	}

	/**
	 * Deselects all currently selected entities
	 */
	public deselect(): void {
		this.select(null);
	}

	/**
	 * Selects the next element. In case none is selected, the first entity is selected
	 * @return The selected element, null in case, no selection was possible
	 */
	public selectNext(): Promise<T | null> {
		if (this.selectedEntity === null) {
			//In case no selection exists, we start at the beginning of the list
			return this.selectFirst();
		}

		if (this.entityList.any()) {
			const entities: T[] = this.entityList.getList();
			const curIndex = entities.indexOf(this.selectedEntity);

			if (curIndex >= 0 && curIndex + 1 < entities.length) {
				return this.select(entities[curIndex + 1]);
			}
		}

		return Promise.resolve(null);
	}

	/**
	 * Selects the previous element. In case none is selected, the last entity is selected
	 * @return The selected element, null in case, no selection was possible
	 */
	public selectPrevious(): Promise<T | null> {
		if (this.selectedEntity === null) {
			return this.selectLast();
		}

		if (this.entityList.any()) {
			const entities: T[] = this.entityList.getList();
			const newIndex = entities.indexOf(this.selectedEntity) - 1;

			if (newIndex >= 0) {
				return this.select(entities[newIndex]);
			}
		}

		return Promise.resolve(null);
	}


	/**
	 * Selects the first element
	 * @return The selected element, null in case, no selection was possible
	 */
	public selectFirst(): Promise<T | null> {
		if (this.entityList.any()) {
			const entities: T[] = this.entityList.getList();

			return this.select(entities[0]);
		}

		return Promise.resolve(null);
	}

	/**
	 * Selects the last element
	 * @return The selected element, null in case, no selection was possible
	 */
	public selectLast(): Promise<T | null> {
		if (this.entityList.any()) {
			const entities: T[] = this.entityList.getList();
			const index = entities.length - 1;

			return this.select(entities[index]);
		}

		return Promise.resolve(null);
	}
}
