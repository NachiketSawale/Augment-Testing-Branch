/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	IEstMainConfigComplete,
	IEstStructureConfigEntity,
	IEstStructureDetailEntity
} from '@libs/estimate/interfaces';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IBasicsCustomizeEstStructureTypeEntity } from '@libs/basics/interfaces';
import { lastValueFrom, Observable, ReplaySubject } from 'rxjs';
import {
	EstimateMainConfigStructureTypeLookupService
} from '../../../../lookups/estimate-structure/estimate-main-config-structure-type-lookup.service';
import { IEstimateMainStructureDetail } from './estimate-main-structure-detail.interface';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainStructureDataService {
	public structureData: IEstStructureDetailEntity[] = [];
	public itemsToSave :IEstStructureDetailEntity[] = [];
	public itemsToDelete:IEstStructureDetailEntity[] = [];
	public estStructureConfig?: IEstStructureConfigEntity | null = null;
	public EstStructureType:IBasicsCustomizeEstStructureTypeEntity|undefined|null = null;
	public currentItem?:IEstimateMainStructureDetail|null=null;
	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly platformConfigurationService = inject(PlatformConfigurationService);
	private estimateMainConfigStructureTypeLookupService = inject(EstimateMainConfigStructureTypeLookupService);
	protected selectedEntities: IEstStructureDetailEntity[] = [];
	protected entities$ = new ReplaySubject<IEstStructureDetailEntity[]>(1);

	public async load(typeId: number): Promise<IEstimateMainStructureDetail | void> {
		this.estimateMainConfigStructureTypeLookupService.setSelectedItemId(typeId);
		const item = await lastValueFrom(this.estimateMainConfigStructureTypeLookupService.getItemByKey({ id: typeId }));
		if (item && item.Id) {
			const structureconfigFk = item.StructureconfigFk ? item.StructureconfigFk : 0;

			const data = await lastValueFrom(this.http.get<IEstMainConfigComplete>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/structureconfig/complete?strConfigFk=' + structureconfigFk));
			if (data.EstStructureType) {
				data.EstStructureType = item;
			}
			this.setData(data);
			return this.currentItem!;
		}
	}

	public async createItem(structConfigFk: number):Promise<IEstStructureDetailEntity>{

		if(structConfigFk <= 0){
			structConfigFk = this.EstStructureType?.StructureconfigFk??0;
		}

		const postData = {
				EstStructureConfigFk : structConfigFk
			};
		const httpRoute = this.platformConfigurationService.webApiBaseUrl + 'estimate/main/structuredetail/create';
		const entity = await lastValueFrom(this.http.post<IEstStructureDetailEntity>(httpRoute, postData));

		if(entity){
			this.addItem(entity);
			this.setSelectedEntities([entity]);
		}
		return entity;
	}
	public setData(completeItemData: IEstMainConfigComplete): void {

		const data = completeItemData.EstStructureDetails;
		this.structureData = data??[];
		this.estStructureConfig = completeItemData.EstStructureConfig;

		this.EstStructureType = completeItemData.EstStructureType;

		if(this.currentItem){
			this.currentItem!.estStructTypeFk = completeItemData.EstStructureType ? completeItemData.EstStructureType.Id : 0;

			this.currentItem!.estStructConfigDesc = completeItemData.EstStructureConfig ? completeItemData.EstStructureConfig?.DescriptionInfo?.Translated : null;
			this.currentItem!.getQuantityTotalToStructure = completeItemData.EstStructureConfig ? completeItemData.EstStructureConfig.GetQuantityTotalToStructure : false;
			this.structureData = completeItemData.EstStructureDetails? completeItemData.EstStructureDetails: [];

			const estStructureConfigFk = completeItemData.EstConfig ? completeItemData.EstConfig.EstStructureConfigFk : null;
			const estStructureTypeFk =completeItemData.EstConfig ? completeItemData.EstConfig.EstStructureTypeFk : null;

			this.currentItem!.isEditStructType = !!(!estStructureTypeFk && !!estStructureConfigFk);


			this.currentItem!.EstAllowanceConfigFk =completeItemData.EstAllowanceConfigFk;
			this.currentItem!.EstAllowanceConfigTypeFk =completeItemData.EstAllowanceConfigTypeFk;
			this.currentItem!.IsUpdStructure = !!completeItemData.EstStructureConfig;
		}

	}
	public getList(){
		return this.structureData;
	}
	public getItemsToSave(){
		return this.itemsToSave.length ? this.itemsToSave : null;
	}

	public getItemsToDelete(){
		return this.itemsToDelete.length ? this.itemsToDelete : null;
	}
	public getStructureConfig(){
		return this.currentItem;
	}

	public getStructureDetails(){
		return this.structureData;
	}

	public setIsUpdStructure(isUpdStructure:boolean){
		this.currentItem!.IsUpdStructure = isUpdStructure;
	}
	public setDataList(items: IEstStructureDetailEntity[] | null): void {
		this.structureData = items ?? [];
		this.entities$.next(this.structureData);
	}

	/**
	 * Retrieves the selected entities.
	 * @param items
	 */
	public setSelectedEntities(items: IEstStructureDetailEntity[]): void {
		this.selectedEntities = items;
	}

	public addItem(item:IEstStructureDetailEntity){
		if(this.structureData){
			this.structureData.push(item);
			this.setItemToSave(item);
			this.refreshGrid();
		}
	}

	/**
	 * Triggers a refresh of the grid to reflect changes in the data.
	 */
	public refreshGrid(): void {
		this.entities$.next(this.structureData);
	}

	/**
	 * Marks an item to be saved.
	 * @param item The item to mark for saving.
	 */
	public setItemToSave(item: IEstStructureDetailEntity): void {
		const modified = this.itemsToSave.find((i) => i.Id === item.Id);
		if (!modified) {
			this.itemsToSave.push(item);
		}
	}

	public deleteItem(item: IEstStructureDetailEntity): void {
		if (item && item.Version) {
			this.itemsToDelete.push(item);
		}
		if (item && item.Id) {
			const index = this.getList().findIndex((d) => d.Id === item.Id);
			if (index > -1) {
				if (item.Version) {
					this.itemsToDelete.push(item);
				}
				this.getList().splice(index, 1);
				this.refreshGrid();
			}
		}
	}

	/**
	 * Deletes the selected items from the list of column configuration details.
	 */
	public delete(): void {
		this.selectedEntities.forEach((item) => {
			this.deleteItem(item);
		});
	}

	public get listChanged$(): Observable<IEstStructureDetailEntity[]> {
		return this.entities$;
	}
	public clear(){
		this.itemsToSave = [];
		this.itemsToDelete = [];
	}
}