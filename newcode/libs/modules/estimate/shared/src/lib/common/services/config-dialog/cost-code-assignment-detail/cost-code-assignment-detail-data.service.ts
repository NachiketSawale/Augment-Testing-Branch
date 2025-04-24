/*
 * Copyright(c) RIB Software GmbH
 */

import { ConfigDetailBaseDataService } from '../config-detail-base-data.service';
import { ICostCodeAssignmentDetailDataService, IEstCostcodeAssignDetailEntity } from '@libs/estimate/interfaces';
import { inject, Injectable } from '@angular/core';
import { TotalsConfigDetailDataService } from '../totals-config-detail/totals-config-detail-data.service';
import { forkJoin, lastValueFrom, map, Observable } from 'rxjs';
import { ICostCodeEntity } from '@libs/basics/interfaces';
import { BasicsSharedCostCodeLookupService } from '@libs/basics/shared';

/**
 * Cost code assignment detail data service
 */
@Injectable({
	providedIn: 'root',
})
export class CostCodeAssignmentDetailDataService extends ConfigDetailBaseDataService<IEstCostcodeAssignDetailEntity> implements ICostCodeAssignmentDetailDataService {

	private readonly totalsConfigDetailDataService = inject(TotalsConfigDetailDataService);
	private readonly basicsSharedCostCodeLookupService = inject(BasicsSharedCostCodeLookupService);
	private allEntities: IEstCostcodeAssignDetailEntity[] = [];

	/**
	 * constructor
	 */
	public constructor() {
		super();
		this.totalsConfigDetailDataService.setCostCodeAssignmentDetailDataService(this);
	}

	/**
	 * Add item
	 * @param item
	 */
	public override addItem(item: IEstCostcodeAssignDetailEntity): void {
		this.allEntities.push(item);
		super.addItem(item);
	}

	/**
	 * Delete item
	 * @param item
	 */
	public override deleteItem(item: IEstCostcodeAssignDetailEntity): void {
		const index = this.allEntities.findIndex(e => e.Id === item.Id);
		if (index >= 0) {
			this.allEntities.splice(index, 1);
		}
		super.deleteItem(item);
	}

	/**
	 * Clear
	 */
	public override clear(): void {
		this.allEntities = [];
		super.clear();
	}

	/**
	 * Set entities by totals config detail id
	 * @param totalsConfigDetailId
	 */
	public setEntitiesByTotalsConfigDetailId(totalsConfigDetailId: number): void {
		this.entities = this.allEntities.filter(e => e.EstTotalsconfigdetailFk === totalsConfigDetailId);
		this.refreshGrid();
	}

	/**
	 * Copy items by totals config detail id
	 * @param totalsConfigDetailId
	 */
	public async copyItemsByTotalsConfigDetailId(totalsConfigDetailId: number) {
		const dataTemps = this.entities.filter(d => d.EstTotalsconfigdetailFk === totalsConfigDetailId);

		const httpRouteAssign = `${this.platformConfigurationService.webApiBaseUrl}estimate/main/costcodeassigndetail/createcopy`;
		const postDataAssign = {
			EstTotalsConfigDetailFk: totalsConfigDetailId,
			DataAssigns: dataTemps,
		};

		const itemAssigns = await lastValueFrom(this.http.post<IEstCostcodeAssignDetailEntity[]>(httpRouteAssign, postDataAssign));

		itemAssigns.forEach(itemAssign => {
			this.addItem(itemAssign);
		});
	}

	/**
	 * Get all list
	 */
	public getAllList(): IEstCostcodeAssignDetailEntity[] {
		let dataToSave = this.allEntities;
		const totalsToDelete = this.totalsConfigDetailDataService.getItemsToDelete();
		let dataTemp: IEstCostcodeAssignDetailEntity[] = [];
		if (totalsToDelete && totalsToDelete.length > 0) {
			totalsToDelete.forEach(item => {
				dataTemp = dataToSave.filter(d => d.EstTotalsconfigdetailFk === item.Id);
				if (dataTemp && dataTemp.length > 0) {
					dataTemp.forEach(item => {
						const exist = this.itemsToDelete.find(e => e.Id === item.Id);
						if (!exist) {
							this.itemsToDelete.push(item);
						}
					});
				}

				dataToSave = dataToSave.filter(d => d.EstTotalsconfigdetailFk !== item.Id);
			});
		}
		return dataToSave;
	}

	/**
	 * Set data list
	 * @param items
	 */
	public override setDataList(items: IEstCostcodeAssignDetailEntity[]): Observable<IEstCostcodeAssignDetailEntity[]> {
		this.allEntities = items || [];
		if (!items || items.length === 0) {
			return new Observable<IEstCostcodeAssignDetailEntity[]>(observer => {
				observer.next([]);
				observer.complete();
			});
		}

		const curTotalsConfigItem = this.totalsConfigDetailDataService.getSelected();
		if (curTotalsConfigItem) {
			this.entities = items.filter(item => item.EstTotalsconfigdetailFk === curTotalsConfigItem.Id);
		}

		const costCodeObservables = this.entities.map(entity => {
			return this.basicsSharedCostCodeLookupService.getItemByKey({ id : entity.MdcCostCodeFk || 0 });
		});

		return forkJoin(costCodeObservables).pipe(
			map(costCodes => {
				for (let i = 0; i < this.entities.length; i++) {
					this.setAdditionalFields(this.entities[i], costCodes[i]);
				}
				this.refreshGrid();
				return this.entities;
			})
		);
	}

	private setAdditionalFields(entity: IEstCostcodeAssignDetailEntity, costCode: ICostCodeEntity){
		if (costCode) {
			entity.BasUomFk = costCode.UomFk;
			entity.CurrencyFk = costCode.CurrencyFk;
			entity.CostcodeTypeFk = costCode.CostCodeTypeFk;
		}
	}

	/**
	 * Create item
	 * @param totalsAssignDetailFk
	 */
	public createItem(totalsAssignDetailFk: number): Observable<IEstCostcodeAssignDetailEntity> {
		const httpRoute = `${this.platformConfigurationService.webApiBaseUrl}estimate/main/costcodeassigndetail/create`;
		const postData = {
			EstTotalsConfigDetailFk: totalsAssignDetailFk,
		};

		return this.http.post<IEstCostcodeAssignDetailEntity>(httpRoute, postData).pipe(
			map((item: IEstCostcodeAssignDetailEntity) => {
				if (item && item.Id) {
					item.IsDirectRulesCost = true;
					item.IsDirectEnteredCost = true;
					item.IsIndirectCost = true;
					item.IsCostRisk = true;
					item.IsNonCostRisk = true;
					item.Addorsubtract = 1;
					this.addItem(item);
					this.setSelectedEntities([item]);
				}
				return item;
			})
		);
	}
}