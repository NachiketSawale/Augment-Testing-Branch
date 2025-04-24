/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EstimateMainRoundingService } from '../../common/services/rounding/estimate-main-rounding.service';
import { EstimateMainExchangeRateService } from '../../common/services/estimate-main-exchange-rate.service';
import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';
import { getChildrenFunc, getResourcesOfLineItemFunc } from '../../calculation/model/interfaces/resource-children-function.interface';
import { ResourceQuantityCalculationService } from './resource-quantity-calculation.service';

@Injectable({
	providedIn: 'root',
})
export class BudgetCalculationService {
	private readonly estimateMainRoundingService = inject(EstimateMainRoundingService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly estimateMainExchangeRateService = inject(EstimateMainExchangeRateService);
	private readonly resourceQuantityCalculationService = inject(ResourceQuantityCalculationService);

	/**
	 * calculate the quantity total for lineItem budget
	 * @param lineItem
	 */
	public getLiQuantityTotalForBudget(lineItem: IEstLineItemEntity) {
		if (!lineItem) {
			return;
		}
		if (lineItem.IsDisabled) {
			lineItem.QuantityTotalBudget = 0;
		} else {
			const quantityTarget = lineItem.IsLumpsum ? 1
				: this.estimateMainContextService.IsTotalAQBudget ? lineItem.QuantityTarget
					: this.estimateMainContextService.IsCalcTotalWithWQ ? lineItem.WqQuantityTarget : lineItem.QuantityTarget;
			// if the type of item.Quantity isn't [object Number],such as [object Object]
			const quantity = lineItem.Quantity;
			const quantityUnitTarget = quantity * lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor;
			lineItem.QuantityTotalBudget = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : quantityTarget * quantityUnitTarget;
			lineItem.QuantityTotalBudget = this.estimateMainRoundingService.doRoundingValue('QuantityTotal', lineItem.QuantityTotalBudget);
		}
		return lineItem.QuantityTotalBudget;
	}

	/**
	 * calculate the quantity total for resource budget
	 * @param res
	 * @param lineItem
	 */
	public getResQuantityTotalForBudget(res: IEstResourceEntity, lineItem: IEstLineItemEntity): number {
		if (!lineItem || !res) {
			return 0;
		}
		this.getLiQuantityTotalForBudget(lineItem);

		/* QuantityTotal = QuantityTotal (of parent Line Item) x QuantityInternal */
		// resource.QuantityTotal =  lineItem.QuantityTotal * resource.QuantityInternal;
		res.QuantityTotalBudget = (lineItem.QuantityTotalBudget || 0) * res.QuantityInternal;
		res.QuantityTotalBudget = this.estimateMainRoundingService.doRoundingValue('QuantityTotal', res.QuantityTotalBudget);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return res.QuantityTotalBudget!;
	}

	/**
	 * calculate lineItem budget
	 * @param item lineItem
	 * @param field
	 */
	public calItemBudget(item: IEstLineItemEntity, field?:string){
		const qtyTotalForBudget = this.getLiQuantityTotalForBudget(item);
		item.BudgetUnit = this.estimateMainRoundingService.doRoundingValue('BudgetUnit',item.BudgetUnit);
		const budget = item.BudgetUnit && qtyTotalForBudget ? qtyTotalForBudget * item.BudgetUnit : item.Budget;

		if(field === 'BudgetUnit' || field === 'IsOptional' || field === 'IsDisabled' || field === 'IsOptionalIT' || item.IsDisabled || item.IsOptional){
			item.Budget = (item.IsOptional && !item.IsOptionalIT) || item.IsDisabled ? 0 : budget;
		}else if(!item.IsFixedBudget && !item.IsFixedBudgetUnit){
			const opt = this.estimateMainContextService.IsFixedBudgetTotal;
			item.Budget = (item.IsOptional && !item.IsOptionalIT) || item.IsDisabled ? item.Budget : (!opt ? budget : ( item.Budget === 0 && item.BudgetUnit > 0 ) ? budget : item.Budget);
		}else{
			item.Budget = (item.IsOptional && !item.IsOptionalIT) || item.IsDisabled ? 0 : (!item.IsFixedBudget ? budget : item.Budget);
		}
		item.Budget = this.estimateMainRoundingService.doRoundingValue('Budget',item.Budget);
	}

	/**
	 * calculate resource budget
	 * @param item resource
	 * @param lineItem
	 * @param field
	 */
	public calResourceBudget(item: IEstResourceEntity, lineItem: IEstLineItemEntity, field?:string){
		item.ExchangeRate = item.BasCurrencyFk ? this.estimateMainExchangeRateService.getExchRate(item.BasCurrencyFk) : 1;
		const qtyTotalForBudget = this.getResQuantityTotalForBudget(item, lineItem);
		item.BudgetUnit = this.estimateMainRoundingService.doRoundingValue('BudgetUnit',item.BudgetUnit);
		const budget = item.BudgetUnit && qtyTotalForBudget ? qtyTotalForBudget * item.BudgetUnit * item.ExchangeRate : item.Budget;

		if(field === 'BudgetUnit' || field === 'IsOptional' || field === 'IsDisabled' || field === 'IsOptionalIT' || item.IsParentDisabled || item.IsDisabled){
			item.Budget = item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? 0 : budget;
		}else if(!item.IsFixedBudget && !item.IsFixedBudgetUnit){
			const opt = this.estimateMainContextService.IsFixedBudgetTotal;
			item.Budget = item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? item.Budget : (!opt ? budget : ( item.Budget === 0 && item.BudgetUnit > 0 ) ? budget : item.Budget);
		}else{
			item.Budget = item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? 0 : (!item.IsFixedBudget ? budget : item.Budget);
		}
		item.Budget = this.estimateMainRoundingService.doRoundingValue('Budget',item.Budget);
	}

	/**
	 * calculate lineItem budget diff
	 * @param item lineItem
	 * @param getChildren
	 * @param fromResource
	 */
	public calItemBudgetDiff(item: IEstLineItemEntity, getChildren: getResourcesOfLineItemFunc, fromResource?: boolean){
		if(!item){
			return;
		}
		const children = getChildren(item);
		if(children && children.length){
			let totalBudget = 0;
			children.forEach((res) => {
				if(res && !res.IsDisabled && !res.IsDisabledPrc && res.IsBudget){
					totalBudget += res.Budget;
				}
			});
			item.Budget = item.IsFixedBudget ||  item.IsFixedBudgetUnit || item.IsDisabled || (item.IsOptional && !item.IsOptionalIT) ? item.Budget : totalBudget;
			item.Budget = this.estimateMainRoundingService.doRoundingValue('Budget',item.Budget);
			totalBudget = this.estimateMainRoundingService.doRoundingValue('Budget',totalBudget);
			item.BudgetDifference = item.IsDisabled || (item.IsOptional && !item.IsOptionalIT) ? 0 : item.Budget - totalBudget;
			item.BudgetDifference = this.estimateMainRoundingService.doRoundingValue('BudgetDifference',item.BudgetDifference);
		}else{
			item.BudgetDifference = 0;
		}
		this.calItemUnitBudget(item,undefined,fromResource);
	}

	/**
	 * calculate resource budget diff
	 * @param item resource
	 * @param lineItem
	 * @param getChildren
	 * @param fromResource
	 */
	public calResourceBudgetDiff(item: IEstResourceEntity, lineItem: IEstLineItemEntity, getChildren: getChildrenFunc, fromResource?: boolean){
		if(!item){
			return;
		}
		const children = getChildren(item);
		if(children && children.length){
			let totalBudget = 0;
			children.forEach((res) => {
				if(res && !res.IsDisabled && !res.IsDisabledPrc && res.IsBudget){
					totalBudget += res.Budget;
				}
			});
			item.Budget = item.IsFixedBudget ||  item.IsFixedBudgetUnit || item.IsDisabled || item.IsDisabledPrc ? item.Budget : totalBudget;
			item.Budget = this.estimateMainRoundingService.doRoundingValue('Budget',item.Budget);
			totalBudget = this.estimateMainRoundingService.doRoundingValue('Budget',totalBudget);
			item.BudgetDifference = item.IsDisabled || item.IsDisabledPrc ? 0 : item.Budget - totalBudget;
			item.BudgetDifference = this.estimateMainRoundingService.doRoundingValue('BudgetDifference',item.BudgetDifference);
		}else{
			item.BudgetDifference = 0;
		}
		this.calResourceUnitBudget(item, lineItem,undefined, fromResource);
	}

	/**
	 * calculate lineItem budget unit
	 * @param item lineItem
	 * @param field
	 * @param fromResource
	 */
	public calItemUnitBudget(item: IEstLineItemEntity, field?:string, fromResource?: boolean){
		const qtyTotalForBudget = this.getLiQuantityTotalForBudget(item);

		const budgetUnit = item.Budget && qtyTotalForBudget ? item.Budget/(qtyTotalForBudget) : item.Budget;

		if(field === 'Budget' || field === 'IsOptional' || field === 'IsDisabled' || field === 'IsOptionalIT' || field === 'IsDisabledPrc' || item.IsDisabled || item.IsOptional){
			item.BudgetUnit = (item.IsOptional && !item.IsOptionalIT) || item.IsFixedBudgetUnit || item.IsDisabled ? item.BudgetUnit : budgetUnit;
		}else if(!item.IsFixedBudget && !item.IsFixedBudgetUnit){
			const opt = this.estimateMainContextService.IsFixedBudgetTotal;
			item.BudgetUnit = (item.IsOptional && !item.IsOptionalIT) || item.IsDisabled ? item.BudgetUnit : fromResource ? budgetUnit : (opt ? budgetUnit : item.BudgetUnit);
		}else{
			item.BudgetUnit = (item.IsOptional && !item.IsOptionalIT) || item.IsFixedBudgetUnit || item.IsDisabled ? item.BudgetUnit : ( item.Budget && qtyTotalForBudget ? budgetUnit : item.Budget );
		}
		item.BudgetUnit = this.estimateMainRoundingService.doRoundingValue('BudgetUnit',item.BudgetUnit);
	}

	/**
	 * calculate resource budget unit
	 * @param item resource
	 * @param lineItem
	 * @param field
	 * @param fromResource
	 */
	public calResourceUnitBudget(item: IEstResourceEntity, lineItem: IEstLineItemEntity, field?:string, fromResource?: boolean){
		const qtyTotalForBudget = this.getResQuantityTotalForBudget(item, lineItem);
		item.ExchangeRate = item.BasCurrencyFk ? this.estimateMainExchangeRateService.getExchRate(item.BasCurrencyFk) : 1;

		const budgetUnit = item.Budget && qtyTotalForBudget ? item.Budget/(item.ExchangeRate * qtyTotalForBudget) : item.Budget/item.ExchangeRate;

		if(field === 'Budget' || field === 'IsOptional' || field === 'IsDisabled' || field === 'IsOptionalIT' || field === 'IsDisabledPrc' || item.IsParentDisabled || item.IsDisabled){
			item.BudgetUnit = item.IsFixedBudgetUnit || item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? item.BudgetUnit : budgetUnit;
		}else if(!item.IsFixedBudget && !item.IsFixedBudgetUnit){
			const opt = this.estimateMainContextService.IsFixedBudgetTotal;
			item.BudgetUnit = item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? item.BudgetUnit : fromResource ? budgetUnit : (opt ? budgetUnit : item.BudgetUnit);
		}else{
			item.BudgetUnit = item.IsFixedBudgetUnit || item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? item.BudgetUnit : ( item.Budget && qtyTotalForBudget ? budgetUnit : item.Budget/item.ExchangeRate );
		}
		item.BudgetUnit = this.estimateMainRoundingService.doRoundingValue('BudgetUnit',item.BudgetUnit);
	}

	/**
	 * calculate resource budget diff
	 * @param res
	 * @param lineItem
	 * @param resList
	 * @param fromResource
	 */
	public calResBudgetDiff(res:IEstResourceEntity, lineItem: IEstLineItemEntity, resList:IEstResourceEntity[], fromResource?: boolean){
		function getChildren(parent:IEstResourceEntity){
			return resList.filter(item => item.EstResourceFk === parent.Id);
		}
		function getParent(child: IEstResourceEntity){
			return resList.find(item => item.Id === child.EstResourceFk);
		}
		this.calResourceBudgetDiff(res, lineItem, getChildren, fromResource);

		// calculate Budget Difference of all Parent Resources
		let parent = getParent(res);
		while(parent){
			this.calResourceBudgetDiff(parent, lineItem, getChildren, fromResource);
			parent = getParent(parent);
		}
	}

	/**
	 * calculate lineItem budget diff
	 * @param lineItem
	 * @param resList
	 * @param fromResource
	 */
	public calLineItemBudgetDiff(lineItem: IEstLineItemEntity, resList: IEstResourceEntity[], fromResource?:boolean){
		function getChildren(parent: IEstLineItemEntity){
			const children = resList.filter(item => item.EstResourceFk === null && item.EstLineItemFk === parent.Id);
			if(children.length>0){
				return children;
			}else{
				//TODO: waiting for basicsLookupdataLookupDescriptorService
				//let refReslist= basicsLookupdataLookupDescriptorService.getData('refLineItemResources');
				//return _.filter(refReslist, function(item) {return item.EstResourceFk === null && item.EstLineItemFk === parent.Id;});
				return [];
			}
		}
		this.calItemBudget(lineItem);
		this.calItemBudgetDiff(lineItem, getChildren, fromResource);
	}

	/**
	 * calculate lineItem and resource budget diff
	 * @param res
	 * @param resList
	 * @param lineItem
	 */
	public calResourceAndLineItemBudgetDiff(res: IEstResourceEntity, resList:IEstResourceEntity[], lineItem: IEstLineItemEntity){
		this.calResBudgetDiff(res, lineItem, resList,true);
		this.calLineItemBudgetDiff(lineItem, resList, true);
	}

	/**
	 * calculate resource budget
	 * @param item
	 * @param field
	 * @param projectId
	 * @param resList
	 * @param parentLineItem
	 */
	public calculateResourceBudget(item: IEstResourceEntity, field:string, projectId: number, resList: IEstResourceEntity[], parentLineItem: IEstLineItemEntity){
		if(!field || !item || !item.Id || (field !== 'Budget' && field !== 'BudgetUnit')){
			return Promise.resolve();
		}

		function getChildren(parent: IEstResourceEntity){
			return resList.filter(item => item.EstResourceFk === parent.Id);
		}

		return this.estimateMainExchangeRateService.loadData(projectId).then(
			() => {
				this.resourceQuantityCalculationService.calculateQuantityTotalOfResources(parentLineItem, resList, getChildren);
				if (field === 'Budget') {
					this.calResourceUnitBudget(item, parentLineItem, field);// to do calculate qty budget here
				}
				if (field === 'BudgetUnit') {
					this.calResourceBudget(item, parentLineItem, field);
				}
				return this.calResourceAndLineItemBudgetDiff(item, resList, parentLineItem);
			});
	}

	/**
	 * calculate lineItem budget
	 * @param item
	 * @param field
	 * @param projectId
	 * @param resList
	 * @param parentLineItem
	 */
	public calculateBudget(item: IEstLineItemEntity, field:string, projectId: number, resList: IEstResourceEntity[], parentLineItem: IEstLineItemEntity){
		if(!field || !item || !item.Id || (field !== 'Budget' && field !== 'BudgetUnit')){
			return Promise.resolve();
		}

		function getChildren(parent: IEstResourceEntity){
			return resList.filter(item => item.EstResourceFk === parent.Id);
		}

		return this.estimateMainExchangeRateService.loadData(projectId).then(
			() => {
				this.resourceQuantityCalculationService.calculateQuantityTotalOfResources(parentLineItem, resList, getChildren);
				if (field === 'Budget') {
					this.calItemUnitBudget(item, field);// to do calculate qty budget here
				}
				if (field === 'BudgetUnit') {
					this.calItemBudget(item, field);
				}
				return this.calLineItemBudgetDiff(item, resList);
			});
	}

	public calculateSubItemResourceBudget(item: IEstResourceEntity, resList: IEstResourceEntity[], parentLineItem: IEstLineItemEntity, projectId:number){
		if(!item || !item.Id || item.IsFixedBudget){
			return Promise.resolve();
		}
		const children = resList.filter(e => e.EstResourceFk === item.Id);
		if(!children || !children.length){
			return Promise.resolve();
		}

		return this.estimateMainExchangeRateService.loadData(projectId).then(
			() => {
				this.calResourceAndLineItemBudgetDiff(item, resList, parentLineItem);
				return this.calResourceUnitBudget(item, parentLineItem, 'Budget');
			});
	}

	public calculateResourcesBudgetDifference(resources:IEstResourceEntity[], lineItem: IEstLineItemEntity, getChildren: getChildrenFunc){
		resources.forEach(res => {
			this.calResourceBudget(res, lineItem);
			this.calResourceUnitBudget(res, lineItem);
		});

		resources.forEach(res => {
			if(res.EstResourceFk !== null){
				const children = getChildren(res);
				if(!children || !children.length){
					this.calResBudgetDiff(res, lineItem, resources);
				}
			}
		});
		this.calLineItemBudgetDiff(lineItem, resources);
	}
}