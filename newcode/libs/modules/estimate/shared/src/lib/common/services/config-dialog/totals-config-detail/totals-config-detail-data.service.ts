/*
 * Copyright(c) RIB Software GmbH
 */

import { lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { ICostCodeAssignmentDetailDataService, IEstTotalDetail2CostTypeEntity, IEstTotalDetail2ResourceFlagEntity, IEstTotalsConfigDetailEntity } from '@libs/estimate/interfaces';
import { ConfigDetailBaseDataService } from '../config-detail-base-data.service';
import { set } from 'lodash';

/**
 * Totals config detail data service
 */
@Injectable({
	providedIn: 'root',
})
export class TotalsConfigDetailDataService extends ConfigDetailBaseDataService<IEstTotalsConfigDetailEntity> {
	private costCodeAssignmentDetailDataService: ICostCodeAssignmentDetailDataService | null = null;
	private readonly createItemUrl = `${this.platformConfigurationService.webApiBaseUrl}estimate/main/totalsconfigdetail/createitem`;
	/**
	 * Set cost code assignment detail data service
	 * @param costCodeAssignmentDetailDataService
	 */
	public setCostCodeAssignmentDetailDataService(costCodeAssignmentDetailDataService: ICostCodeAssignmentDetailDataService): void {
		this.costCodeAssignmentDetailDataService = costCodeAssignmentDetailDataService;
	}

	/**
	 * Set selected entities
	 * @param entities
	 */
	public override setSelectedEntities(entities: IEstTotalsConfigDetailEntity[]): void {
		super.setSelectedEntities(entities);
		if (this.costCodeAssignmentDetailDataService && entities && entities.length > 0) {
			this.costCodeAssignmentDetailDataService.setEntitiesByTotalsConfigDetailId(entities[0].Id);
		}
	}

	/**
	 * create item
	 * @param totalsConfigFk
	 */
	public async createItem(totalsConfigFk: number): Promise<IEstTotalsConfigDetailEntity> {
		const postData = {
			EstTotalsConfigFk: totalsConfigFk,
			Sorting: this.getList().length + 1,
		};

		const item = await lastValueFrom(this.http.post<IEstTotalsConfigDetailEntity>(this.createItemUrl, postData));
		if (item && item.Id) {
			this.addItem(item);
			this.setSelectedEntities([item]);
		}
		return item;
	}

	/**
	 * Create deep copy
	 * @param totalsConfigFk
	 * @param currentItem
	 * @param sorting
	 */
	public async createDeepCopy(totalsConfigFk: number, currentItem: IEstTotalsConfigDetailEntity, sorting: number): Promise<IEstTotalsConfigDetailEntity> {
		const postData = {
			EstTotalsConfigFk: totalsConfigFk,
		};

		const item = await lastValueFrom(this.http.post<IEstTotalsConfigDetailEntity>(this.createItemUrl, postData));

		if (item && item.Id) {
			item.BasUomFk = currentItem.BasUomFk;
			if (item.DescriptionInfo && currentItem.DescriptionInfo) {
				item.DescriptionInfo.Description = `${currentItem.DescriptionInfo.Description}(1)`;
				item.DescriptionInfo.Translated = `${currentItem.DescriptionInfo.Translated}(1)`;
			}
			item.EstTotalsconfigFk = currentItem.EstTotalsconfigFk;
			item.IsLabour = currentItem.IsLabour;
			item.IsBold = currentItem.IsBold;
			item.IsItalic = currentItem.IsItalic;
			item.IsUnderline = currentItem.IsUnderline;
			item.LineType = currentItem.LineType;
			item.Sorting = sorting;

			item.EstTotalDetail2CostTypes = currentItem.EstTotalDetail2CostTypes;
			item.EstTotalDetail2ResourceFlags = currentItem.EstTotalDetail2ResourceFlags;
			item.Modified = true;

			this.addItem(item);
			this.setSelectedEntities([item]);
			//TODO-walt
			// this.updateSelection();
			// this.onUpdateList.fire(data);
		}

		if (this.costCodeAssignmentDetailDataService) {
			this.costCodeAssignmentDetailDataService.copyItemsByTotalsConfigDetailId(currentItem.Id);
		}

		//TODO-walt
		//this.selectToLoad.fire(assignData);

		return item;
	}

	/**
	 * Get total2 cost type details to save
	 * @param configDetails
	 */
	public getTotal2CostTypeDetailsToSave(configDetails?: IEstTotalsConfigDetailEntity[] | null) {
		return this.getTotal2DetailsToSaveByType<IEstTotalDetail2CostTypeEntity>('EstTotalDetail2CostTypes', 'EstCostTypeFk', configDetails);
	}

	/**
	 * Get total2 resource flag details to save
	 * @param configDetails
	 */
	public getTotal2ResourceFlagDetailsToSave(configDetails?: IEstTotalsConfigDetailEntity[] | null) {
		return this.getTotal2DetailsToSaveByType<IEstTotalDetail2ResourceFlagEntity>('EstTotalDetail2ResourceFlags', 'EstResourceFlagFk', configDetails);
	}

	private getTotal2DetailsToSaveByType<T extends { Id: number; EstTotalsConfigDetailFk?: number | null }>(fieldType: 'EstTotalDetail2CostTypes' | 'EstTotalDetail2ResourceFlags', fieldKey: keyof T, configDetails?: IEstTotalsConfigDetailEntity[] | null): T[] {
		const result: T[] = [];
		if(configDetails){
			configDetails.forEach((detail) => {
				const itemsToDelete = this.getItemsToDelete();
				if (itemsToDelete && itemsToDelete.findIndex((item) => item.Id === detail.Id) > -1) {
					detail[fieldType] = [];
					detail.Modified = true;
				}
				if (detail && detail.Modified && detail[fieldType]) {
					if (detail[fieldType]!.length === 0) {
						result.push({ Id: -1, EstTotalsConfigDetailFk: detail.Id } as T);
					}
					detail[fieldType]!.forEach((item) => {
						const obj = {} as T;
						set(obj, fieldKey, item.Id === 0 ? null : item.Id);
						obj.EstTotalsConfigDetailFk = detail.Id;
						result.push(obj);
					});
				}
			});
		}
		return result;
	}
}
