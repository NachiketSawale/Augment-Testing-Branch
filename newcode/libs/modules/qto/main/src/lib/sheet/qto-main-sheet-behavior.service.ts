/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { findIndex, forEach } from 'lodash';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { QtoMainSheetDataService } from './qto-main-sheet-data.service';
import { IQtoSheetEntity } from '../model/entities/qto-sheet-entity.interface';
import {IQtoMainDetailGridEntity} from '../model/qto-main-detail-grid-entity.class';

@Injectable({
	providedIn: 'root'
})
export class QtoMainSheetBehavior implements IEntityContainerBehavior<IGridContainerLink<IQtoSheetEntity>, IQtoSheetEntity> {

	private dataService: QtoMainSheetDataService;
	
	public constructor() {
		this.dataService = inject(QtoMainSheetDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IQtoSheetEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe(data => {
			this.loadSheets();
		});
		containerLink.registerSubscription(dataSub);

		const selectionChanged = this.dataService.selectionChanged$.subscribe(data => {
			this.selectionChangedCallBack();
		});
		containerLink.registerSubscription(selectionChanged);

		const entitiesModified = this.dataService.entitiesModified$.subscribe(data => {
			this.onEntityDeleted(data);
		});
		containerLink.registerSubscription(entitiesModified);
	}

	private selectionChangedCallBack() {
		// TODO: Temporarily commenting out to resolve eslint the error because it never used.
		// const selectItem = this.dataService.getSelectedEntity();
		// const qtoHeader = this.dataService.parentService.getSelectedEntity();
		//TODO: missing => qtoheader status -lnt
	}

	//TODO: missing => onFilterMarksChanged, the event not ready -lnt

	private onEntityDeleted(deletedItems: IQtoSheetEntity[]) {
		//qtoMainStrucutrueFilterService.removeFilter('QtoSheets'); //TODO: filter not ready -lnt

		if (deletedItems) {
			const qtoDetails = this.dataService.qtoDetailDataService.getList();
			const qtoDetailsToDelete = qtoDetails
				.map((item) => {
					const index = findIndex(deletedItems, {'Id': item.QtoSheetFk});
					if (index !== -1) {
						return item;
					}
					return null;
				})
				.filter((item) => item !== null) as IQtoMainDetailGridEntity[];

			this.dataService.qtoDetailDataService.delete(qtoDetailsToDelete);
		}
	}

	private loadSheets(){
		const itemList = this.dataService.getList();
		forEach(itemList, (item) => {
			if (!item.PageNumber) {
				this.dataService.updateReadOnly(item, ['Description'], true);
			}
		});
	}

}