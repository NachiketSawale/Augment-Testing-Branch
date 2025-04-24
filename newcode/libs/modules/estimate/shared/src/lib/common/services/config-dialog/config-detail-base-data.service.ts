/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { IEstTotalsConfigDetailEntity } from '@libs/estimate/interfaces';

export abstract class ConfigDetailBaseDataService<TEntity extends IEstTotalsConfigDetailEntity>{
	protected platformConfigurationService = inject(PlatformConfigurationService);
	protected http = inject(HttpClient);
	protected editType: string | null = null;
	protected itemsToSave: TEntity[] = [];
	protected itemsToDelete: TEntity[] = [];
	protected entities : TEntity[] = [];
	protected entities$ = new ReplaySubject<TEntity[]>(1);
	protected selectedEntities: TEntity[] = [];
	protected selectedEntities$ = new ReplaySubject<TEntity[]>(1);

	/**
	 * Register for listLoaded event
	 * @return return Observable indicating that the list of managed entities has changed
	 */
	public get listChanged$(): Observable<TEntity[]> {
		return this.entities$;
	}

	/**
	 * Gets the data entities managed & loaded by the data service.
	 */
	public getList(){
		return this.entities;
	}

	/**
	 * Sets the list of column configuration details.
	 * @param items The array of new column configuration details to set.
	 */
	public setDataList(items: TEntity[] | null): void {
		this.entities = items ?? [];
		this.entities$.next(this.entities);
	}

	/**
	 * Retrieves the selected entities.
	 * @param items
	 */
	public setSelectedEntities(items: TEntity[]): void {
		this.selectedEntities = items;
		this.selectedEntities$.next(this.selectedEntities);
	}

	/**
	 * Retrieves the selected entity
	 */
	public getSelected(): TEntity | null {
		return this.selectedEntities.length ? this.selectedEntities[0] : null;
	}

	/**
	 * Adds a new item to the list of column configuration details and marks it for saving.
	 * @param item The new item to add.
	 */
	public addItem(item: TEntity): void {
		this.entities.push(item);
		this.setItemToSave(item);
		this.refreshGrid();
	}

	/**
	 * Triggers a refresh of the grid to reflect changes in the data.
	 */
	public refreshGrid(): void {
		this.entities$.next(this.entities);
	}

	/**
	 * Marks an item to be saved.
	 * @param item The item to mark for saving.
	 */
	public setItemToSave(item: TEntity): void {
		const modified = this.itemsToSave.find((i) => i.Id === item.Id);
		if (!modified) {
			this.itemsToSave.push(item);
		}
	}

	/**
	 * Retrieves the items marked for saving.
	 * @returns An array of items marked for saving.
	 */
	public getItemsToSave(): TEntity[] | null {
		return this.itemsToSave.length ? this.itemsToSave : null;
	}

	/**
	 * Retrieves the items marked for deletion.
	 * @returns An array of items marked for deletion.
	 */
	public getItemsToDelete(): TEntity[] | null {
		return this.itemsToDelete.length ? this.itemsToDelete : null;
	}

	/**
	 * Clears the lists of items to save and delete.
	 */
	public clear(): void {
		this.itemsToSave = [];
		this.itemsToDelete = [];
	}

	/**
	 * Sets the edit type.
	 * @param editType The edit type to set.
	 */
	public setEditType(editType: string): void {
		this.editType = editType;
	}

	/**
	 * Retrieves the edit type.
	 * @returns The current edit type.
	 */
	public getEditType(): string | null {
		return this.editType;
	}

	/**
	 * delete item
	 * @param selectedItem
	 */
	public deleteItem(selectedItem: TEntity) {
		this.entities = this.entities.filter(e => e.Id !== selectedItem.Id);
		this.itemsToSave = this.itemsToSave.filter(e => e.Id !== selectedItem.Id);
		if(selectedItem.Version){
			this.itemsToDelete.push(selectedItem);
		}
		this.refreshGrid();
	}

	/**
	 * Deletes the selected items from the list of configuration details.
	 */
	public delete(): void {
		this.selectedEntities.forEach((item) => {
			this.deleteItem(item);
		});
	}
}