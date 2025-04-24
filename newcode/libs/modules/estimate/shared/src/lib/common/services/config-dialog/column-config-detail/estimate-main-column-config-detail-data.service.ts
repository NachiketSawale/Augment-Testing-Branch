/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEstColumnConfigDetailEntity } from '@libs/estimate/interfaces';
import { lastValueFrom, Subject } from 'rxjs';
import { ConfigDetailBaseDataService } from '../config-detail-base-data.service';

@Injectable({
	providedIn: 'root',
})
export class EstimateMainColumnConfigDetailDataService extends ConfigDetailBaseDataService<IEstColumnConfigDetailEntity> {
	public onColumnConfigStatusChange = new Subject<boolean>();
	private columnConfigId: number = 0;

	/**
	 * Verifies the status of the column configuration list.
	 * @returns A boolean indicating if the column configuration list is valid.
	 */
	public verifyColumnConfigListStatus(isConflict?: boolean): boolean {
		let isValid = true;
		if (isConflict) {
			this.getList().forEach((item) => {
				if (!isValid) {
					return;
				}
				let status = false;
				if (item.ColumnId && item.LineType && item.DescriptionInfo && item.DescriptionInfo.Description) {
					if (item.LineType === 1 && item.MdcCostCodeFk !== null) {
						status = true;
					} else if (item.LineType === 2 && item.MaterialLineId) {
						status = true;
					}
				}
				isValid = status;
			});
		} else {
			isValid = false;
		}

		this.onColumnConfigStatusChange.next(isValid);
		return isValid;
	}

	/**
	 * Sets the column configuration ID.
	 * @param id The new column configuration ID to set.
	 */
	public setColumnConfigId(id: number): void {
		this.columnConfigId = id;
	}

	/**
	 * Retrieves the column configuration ID.
	 * @returns The current column configuration ID.
	 */
	public getColumnConfigId(): number {
		return this.columnConfigId;
	}

	/**
	 * Retrieves the module name.
	 * @returns The module name.
	 */
	public getModule(): string {
		return 'estimate.main';
	}

	/**
	 * Sets the column configuration details to view configuration.
	 * @param uid The UID for the view configuration.
	 * @param estColumnConfigDetailsToSave The column configuration details to save.
	 */
	public setColumnConfigDetailsToViewConfig(uid: string, estColumnConfigDetailsToSave: IEstColumnConfigDetailEntity[]): void {
		//TODO-Walt
		// Implementation depends on the interaction with MainViewService and needs to be adapted accordingly.
	}

	/**
	 * Moves an item up in the list of column configuration details.
	 * @param type The ID of the item to move up.
	 * @param grid The grid object.
	 */
	public moveUp(type: number, grid: object): void {
		//TODO-Walt: wait for <estimateMainCommonService>.moveSelectedItemTo(type,grid);
	}

	/**
	 * Moves an item down in the list of column configuration details.
	 * @param type The ID of the item to move up.
	 * @param grid The grid object.
	 */
	public moveDown(type: number, grid: object): void {
		//TODO-Walt: wait for <estimateMainCommonService>.moveSelectedItemTo(type,grid);
	}

	/**
	 * Adds a new item to the list of column configuration details.
	 * @param columnConfigFk The column configuration foreign key.
	 */
	public async createItem(columnConfigFk: number): Promise<IEstColumnConfigDetailEntity> {
		const httpRoute = this.platformConfigurationService.webApiBaseUrl + 'estimate/main/columnconfigdetail/create';
		const postData = {
			EstColumnConfigFk: columnConfigFk,
		};

		const item = await lastValueFrom(this.http.post<IEstColumnConfigDetailEntity>(httpRoute, postData));
		if (item && item.Id) {
			item.Sorting = this.getList().length + 1;
			//this.estimateMainColumnConfigDetailProcessService.processItem(item);
			this.addItem(item);
			this.setSelectedEntities([item]);
		}
		return item;
	}
}
