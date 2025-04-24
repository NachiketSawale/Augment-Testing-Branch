/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
	IEstMainConfigComplete, IEstRootAssignmentDetailEntity, IEstRootAssignmentParamEntity
} from '@libs/estimate/interfaces';
import { lastValueFrom, Observable, ReplaySubject } from 'rxjs';
import {
	EstimateMainRuleAssignTypeLookupService
} from '../../../../lookups/estimate-rule-config/estimate-main-rule-assign-type-lookup.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IBasicsCustomizeEstRootAssignmentTypeEntity } from '@libs/basics/interfaces';
import {
	EstimateMainRuleAssignRuleLookupService
} from '../../../../lookups/estimate-rule-config/estimate-main-rule-assign-rule-lookup.service';


@Injectable({
	providedIn: 'root'
})
export class EstimateMainRuleAssignDataService {
  private readonly estimateMainRuleAssignRuleLookupService = inject(EstimateMainRuleAssignRuleLookupService);
	private readonly estimateMainRuleAssignTypeLookupService = inject(EstimateMainRuleAssignTypeLookupService);
	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly platformConfigurationService = inject(PlatformConfigurationService);
  public estRootAssignmentType:IBasicsCustomizeEstRootAssignmentTypeEntity|null|undefined;
	public estRootAssignmentDetails?:IEstRootAssignmentDetailEntity[]|null = [];
	public estRootAssignmentParams?:IEstRootAssignmentParamEntity[]|null = [];
	public estRuleAssignTypeFk:number =0;
	public itemsToSave :IEstRootAssignmentDetailEntity[] = [];
	public itemsToDelete:IEstRootAssignmentDetailEntity[] = [];
	public rootAssignmentDetails:IEstRootAssignmentDetailEntity[]=[];
	protected selectedEntities: IEstRootAssignmentDetailEntity[] = [];
	protected currentItem:IBasicsCustomizeEstRootAssignmentTypeEntity|null|undefined=null;
	protected entities$ = new ReplaySubject<IEstRootAssignmentDetailEntity[]>(1);
	public async load(typeId: number): Promise<IBasicsCustomizeEstRootAssignmentTypeEntity | void> {
		this.estimateMainRuleAssignTypeLookupService.setSelectedItemId(typeId);
		const item = await lastValueFrom(this.estimateMainRuleAssignTypeLookupService.getItemByKey({ id: typeId }));
		if (item && item.Id) {


			const data = await lastValueFrom(this.http.get<IEstMainConfigComplete>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/rootassignmenttype/complete?rootAssignmentTypeFk=' + item.Id));
			if (data) {
				data.EstRootAssignmentType = item;
			}
			 this.setData(data);
			 return this.currentItem!;
		}
	}

	public setData(completeItemData: IEstMainConfigComplete){
		if(completeItemData){
			this.estRootAssignmentType = completeItemData.EstRootAssignmentType;
			this.estRootAssignmentDetails = completeItemData.EstRootAssignmentDetails;
			this.estRootAssignmentParams = completeItemData.EstRootAssignmentParams;
		}
		this.estRuleAssignTypeFk = completeItemData.EstRootAssignmentType ? completeItemData.EstRootAssignmentType.Id : 0;

		let contextId:number = 0;
		if(completeItemData.ContextFk??0 > 0){
			contextId = completeItemData.ContextFk??0;
		}else if(completeItemData.EstConfigType) {
			contextId = completeItemData.EstConfigType.MdcContextFk??0;
		}
		this.estimateMainRuleAssignRuleLookupService.mdcLineItemContextFk=completeItemData?.EstRootAssignmentType?.LineitemcontextFk??0;
		this.estimateMainRuleAssignTypeLookupService.setMdcContextId(contextId);
		this.estimateMainRuleAssignTypeLookupService.setSelectedItemId(this.estRuleAssignTypeFk);

		this.rootAssignmentDetails = completeItemData.EstRootAssignmentDetails??[];

		this.currentItem = completeItemData.EstRootAssignmentType;
		if(this.currentItem){
			this.currentItem!.DescriptionInfo = completeItemData.EstRootAssignmentType ? completeItemData.EstRootAssignmentType.DescriptionInfo:undefined;
		}
	}

	public addItem(item:IEstRootAssignmentDetailEntity){
		if(this.rootAssignmentDetails){
			this.rootAssignmentDetails.push(item);
			this.setItemToSave(item);
			this.refreshGrid();
		}
	}
	public async createItem(rootAssignmentTypeFk: number):Promise<IEstRootAssignmentDetailEntity>{

		if(rootAssignmentTypeFk <= 0){
			rootAssignmentTypeFk = this.estimateMainRuleAssignTypeLookupService?.getSelectItemId()??0;
		}

		const postData = {
			EstRootAssignmentTypeFk : rootAssignmentTypeFk
		};
		const httpRoute = this.platformConfigurationService.webApiBaseUrl + 'estimate/main/rootassignmentdetail/create';
		const entity = await lastValueFrom(this.http.post<IEstRootAssignmentDetailEntity>(httpRoute, postData));

		if(entity){
			this.addItem(entity);
			this.setSelectedEntities([entity]);
		}
		return entity;
	}
	/**
	 * Triggers a refresh of the grid to reflect changes in the data.
	 */
	public refreshGrid(): void {
		this.entities$.next(this.rootAssignmentDetails);
	}

	/**
	 * Retrieves the selected entities.
	 * @param items
	 */
	public setSelectedEntities(items: IEstRootAssignmentDetailEntity[]): void {
		this.selectedEntities = items;
	}
	/**
	 * Marks an item to be saved.
	 * @param item The item to mark for saving.
	 */
	public setItemToSave(item: IEstRootAssignmentDetailEntity): void {
		const modified = this.itemsToSave.find((i) => i.Id === item.Id);
		if (!modified) {
			this.itemsToSave.push(item);
		}
	}
	public deleteItem(item: IEstRootAssignmentDetailEntity): void {
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

	public get listChanged$(): Observable<IEstRootAssignmentDetailEntity[]> {
		return this.entities$;
	}

	public getList(){
		return this.rootAssignmentDetails;
	}
	public clear(){
		this.itemsToSave = [];
		this.itemsToDelete = [];
	}
}