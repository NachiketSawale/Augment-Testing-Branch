/*
 * Copyright(c) RIB Software GmbH
 */

import { EstimateMainRoundingService } from '../../common/services/rounding/estimate-main-rounding.service';
import { inject, Injectable } from '@angular/core';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';
import { find, isArray, uniqBy } from 'lodash';
import { EstimateMainResourceTypeService } from '../../common/services/estimate-main-resource-type.service';
import { MultiCurrencyCommonService } from '../../common/services/multi-currency-common.service';
import { getChildrenFunc } from '../../calculation/model/interfaces/resource-children-function.interface';
import { ResourceQuantityCalculationService } from './resource-quantity-calculation.service';
import { BudgetCalculationService } from './budget-calculation.service';

/**
 * The current service is mainly used for calculating the quantity, hour, cost, and budget of lineItems and resources
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainCompleteCalculationService{
	private readonly estimateMainRoundingService = inject(EstimateMainRoundingService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly estimateMainResourceTypeService = inject(EstimateMainResourceTypeService);
	private readonly multiCurrencyCommonService = inject(MultiCurrencyCommonService);
	private readonly resourceQuantityCalculationService = inject(ResourceQuantityCalculationService);
	private readonly budgetCalculationService = inject(BudgetCalculationService);

	/**
	 * calculate Cost in Local Currency
	 * @param resource
	 */
	public calCostInLocalCurrency(resource: IEstResourceEntity) {
		this.multiCurrencyCommonService.calculateMultiCurrencies(resource);
	}

	/**
	 * calculate quantity and cost of lineItem and its resource
	 * @param lineItem
	 * @param resourceList
	 * @param getChildrenResources
	 */
	public updateResourceCore(lineItem: IEstLineItemEntity, resourceList:IEstResourceEntity[], getChildrenResources: getChildrenFunc){
		if(!lineItem || !isArray(resourceList)){
			return;
		}

		const resourceTree = resourceList.filter(resource =>{
			return resource.EstResourceFk === null;
		});

		/*
		 * calculate quantity of resource tree
		 * */
		resourceTree.forEach(resource => {
			this.calculateResourceTree(resource, lineItem, getChildrenResources, null,1);
		});

		// calculate budget of all resources
		this.budgetCalculationService.calculateResourcesBudgetDifference(resourceList, lineItem, getChildrenResources);

		// calculate LineItem Co2 (Sustainability)
		this.calculateLineItemCo2Total(lineItem, resourceList);
	}

	/**
	 * calculate quantity and cost of lineItem and resources which resource is in list
	 * @param lineItem
	 * @param resourceList
	 */
	public updateResourcesInList(lineItem: IEstLineItemEntity, resourceList: IEstResourceEntity[]){
		this.updateResourceCore(lineItem, resourceList, this.createGetChildrenFunc(resourceList));
	}

	/**
	 * calculate quantity and cost of lineItem and resources which resource is in list
	 * @param lineItem
	 * @param resourceList
	 */
	public updateResourcesNew(lineItem: IEstLineItemEntity, resourceList:IEstResourceEntity[]){
		this.updateResourceCore(lineItem, resourceList, this.createGetChildrenFunc(resourceList));
	}

	/**
	 * calculate quantity and cost of current resource and its children
	 * @param resource
	 * @param lineItem
	 * @param resourceList
	 */
	public updateResourceNew(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, resourceList: IEstResourceEntity|null){

		if(!resource || resource.Id <= 0){
			return [];
		}

		if(!lineItem || !isArray(resourceList)){
			return [];
		}

		const getChildrenResources = this.createGetChildrenFunc(resourceList);

		const resourcesChanged = this.calculateResourceCore(resource, lineItem, resourceList);

		// calculate budget of all resources
		this.budgetCalculationService.calculateResourcesBudgetDifference(resourceList, lineItem, getChildrenResources);

		// calculate LineItem Co2 (Sustainability)
		this.calculateLineItemCo2Total(lineItem, resourceList);

		return resourcesChanged;
	}

	public getAncestorsCostFactor(ancestors: IEstResourceEntity[]){
		return isArray(ancestors) && ancestors.length > 0 ? ancestors.reduce((accumulator, currentValue) => accumulator * currentValue.CostFactor1 * currentValue.CostFactor2, 1) : 1;
	}

	public getParent(ancestors:IEstResourceEntity[]){
		return isArray(ancestors) && ancestors.length > 0 ? ancestors[0] : null;
	}

	private createGetChildrenFunc(resources:IEstResourceEntity[]){
		return function getChildrenResources(parentResource:IEstResourceEntity){
			if(parentResource && isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
				return parentResource.EstResources;
			}
			const children = resources.filter(item => item.EstResourceFk === parentResource.Id);
			return uniqBy(children, 'Id');
		};
	}

	/**
	 * calculate quantity and cost of current resource, its parent and its children
	 * @param resource
	 * @param lineItem
	 * @param resources
	 */
	public calculateResourceCore(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, resources: IEstResourceEntity[] | null): IEstResourceEntity[]{
		let retValue: IEstResourceEntity[] = [];
		if(!resource || !lineItem || !resources){
			return retValue;
		}

		const getChildrenResources = this.createGetChildrenFunc(resources);

		/* collect ancestors */
		const ancestors: IEstResourceEntity[] = [];
		let currentResource: IEstResourceEntity | null | undefined = resource;
		while(currentResource && currentResource.EstResourceFk){
			currentResource = resources.find(e => e.Id === currentResource?.EstResourceFk);
			if(currentResource){
				ancestors.push(currentResource);
			}
		}

		/* calculate current resource and its children */
		const resourceChanged = this.calculateResourceTree(resource, lineItem, getChildrenResources, this.getParent(ancestors), this.getAncestorsCostFactor(ancestors));
		if(resourceChanged && resourceChanged.length > 0){
			retValue = retValue.concat(resourceChanged);
		}

		/* calculate ancestors */
		while (ancestors.length > 0){
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const currentItem = ancestors.shift()!;
			if(currentItem && (this.estimateMainResourceTypeService.isSubItemOrCompositeAssembly(currentItem) || this.estimateMainResourceTypeService.isEquipmentAssembly(currentItem))){
				const children = getChildrenResources(currentItem);
				if(children && children.length){
					/* the costUnit of subItem equal the sum of its children's cost/Unit subItem */
					this.calculateCostUnitOfSubItem(currentItem, children);
					this.calculateAdvancedAllowanceOfSubItem(currentItem, children);
					// calculate Parent Resource Co2 (Sustainability)
					this.calculateParentResourceCo2(currentItem, children);
					// TODO: set original price and quantity
					if(currentItem.Version === 0){
						currentItem.QuantityOriginal = currentItem.Quantity;
						currentItem.CostUnitOriginal = currentItem.CostUnit;
					}
				}else{
					currentItem.CostUnit = 0;
					currentItem.HoursUnit = 0;
					currentItem.DayWorkRateUnit = 0;
					currentItem.Co2Source = 0;
					currentItem.Co2Project = 0;
				}
			}
			this.calculateCostOfResource(currentItem, lineItem, this.getParent(ancestors), this.getAncestorsCostFactor(ancestors));
			this.calculateResourceCo2Total(currentItem);
			retValue.push(currentItem);
		}

		return retValue;
	}

	/**
	 * calculate quantity and cost of resource and its children
	 * @param resource
	 * @param lineItem
	 * @param getChildrenFunc
	 * @param parentResource
	 * @param anscetorCostFactor
	 */
	public calculateResourceTree(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, getChildrenFunc: getChildrenFunc, parentResource: IEstResourceEntity|null, anscetorCostFactor:number = 1){

		let retValue = [resource];

		this.resourceQuantityCalculationService.calculateQuantityOfResource(resource, lineItem, parentResource);

		/* subItem */
		if(this.estimateMainResourceTypeService.isSubItemOrCompositeAssembly(resource) || this.estimateMainResourceTypeService.isEquipmentAssembly(resource)){

			const children = getChildrenFunc(resource);

			if(children && children.length){

				/* calculate anscetor costFactor */
				let costFactor = anscetorCostFactor;
				costFactor = costFactor * resource.CostFactor1 * resource.CostFactor2;

				children.forEach(child =>{
					const childrenChanged = this.calculateResourceTree(child, lineItem, getChildrenFunc, resource, costFactor);
					if(childrenChanged && childrenChanged.length > 0){
						retValue = retValue.concat(childrenChanged);
					}
				});

				/* the costUnit of subItem equal the sum of its children's cost/Unit subitem */
				this.calculateCostUnitOfSubItem(resource, children);

				this.calculateAdvancedAllowanceOfSubItem(resource, children);

				// calculate Parent Resource Co2 (Sustainability)
				this.calculateParentResourceCo2(resource, children);

				// TODO: set original price and quantity
				if(resource.Version === 0){
					resource.QuantityOriginal = resource.Quantity;
					resource.CostUnitOriginal = resource.CostUnit;
				}
			}else{
				resource.CostUnit = 0;
				resource.HoursUnit = 0;
				resource.DayWorkRateUnit = 0;
				resource.Co2Source = 0;
				resource.Co2Project = 0;
			}
		}

		this.calculateCostOfResource(resource, lineItem, parentResource, anscetorCostFactor);

		this.calculateResourceCo2Total(resource);

		return retValue;
	}

	public calculateCostUnitOfSubItem(resource: IEstResourceEntity, children: IEstResourceEntity[]){
		resource.CostUnit = 0;
		resource.HoursUnit = 0;
		resource.DayWorkRateUnit = 0;

		children.forEach(child =>{
			// let isCost = child.IsCost || (useParentIsCost && parentIsCost);
			// && isCost
			if(!child.IsDisabled && !child.IsDisabledPrc && !child.IsInformation){
				resource.CostUnit += child.CostUnit * child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1);
				resource.CostUnit =  this.estimateMainRoundingService.doRoundingValue('CostUnit',resource.CostUnit);
				resource.HoursUnit += child.HoursUnit * child.QuantityReal * child.HourFactor;
				resource.HoursUnit =  this.estimateMainRoundingService.doRoundingValue('HoursUnit',resource.HoursUnit);
				resource.DayWorkRateUnit += child.DayWorkRateUnit * child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1);
				resource.DayWorkRateUnit =  this.estimateMainRoundingService.doRoundingValue('DayWorkRateUnit',resource.DayWorkRateUnit);
			}
		});
	}

	public calculateResourceCo2Total(resource: IEstResourceEntity) {
		if (resource.Co2Source) {
			resource.Co2SourceTotal = resource.Co2Source * resource.QuantityTotal;
			resource.Co2SourceTotal = this.estimateMainRoundingService.doRoundingValue('QuantityTotal', resource.Co2SourceTotal);
		}
		if (resource.Co2Project) {
			resource.Co2ProjectTotal = resource.Co2Project * resource.QuantityTotal;
			resource.Co2ProjectTotal = this.estimateMainRoundingService.doRoundingValue('QuantityTotal', resource.Co2ProjectTotal);
		}

		if (resource.EstResources && resource.EstResources.length > 0) {
			const children = resource.EstResources;
			if (children && children.length) {
				children.forEach((child) => {
					this.calculateResourceCo2Total(child);
				});
			}
			this.calculateParentResourceCo2(resource, children);
		}

		if(this.estimateMainResourceTypeService.isSubItem(resource) && (!resource.EstResources || resource.EstResources.length === 0)) {
			resource.Co2SourceTotal = 0;
			resource.Co2ProjectTotal = 0;
			resource.Co2Source = 0;
			resource.Co2Project = 0;
		}
	}

	public calculateParentResourceCo2(resource: IEstResourceEntity, children: IEstResourceEntity[]) {
		resource.Co2Source = 0;
		resource.Co2Project = 0;

		children.forEach(child =>{
			if(!child.IsDisabled && !child.IsDisabledPrc){
				if (child.Co2Source) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					resource.Co2Source! += child.Co2Source * child.QuantityReal;
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					resource.Co2Source =  this.estimateMainRoundingService.doRoundingValue('Quantity',resource.Co2Source!);
				}
				if (child.Co2Project) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					resource.Co2Project! += child.Co2Project * child.QuantityReal;
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					resource.Co2Project =  this.estimateMainRoundingService.doRoundingValue('Quantity',resource.Co2Project!);
				}
			}
		});
	}

	public calculateLineItemCo2Total(lineItem: IEstLineItemEntity, resourceList: IEstResourceEntity[]) {
		if (!lineItem || !resourceList || resourceList.length === 0) {
			return;
		}

		lineItem.Co2SourceTotal = 0;
		lineItem.Co2ProjectTotal = 0;

		let parentResources = resourceList.filter((item) => {
			return item.EstResourceFk === null && item.EstLineItemFk === lineItem.Id && item.EstHeaderFk === lineItem.EstHeaderFk;
		});

		if(parentResources.length === 0){
			parentResources = resourceList.filter((item) => {
				return item.EstResourceFk === null && item.EstLineItemFk === lineItem.EstLineItemFk && item.EstHeaderFk === lineItem.EstHeaderFk;
			});
		}

		lineItem.Co2SourceTotal = 0;
		lineItem.Co2ProjectTotal = 0;

		parentResources.forEach((resource) => {
			if (resource && !resource.IsDisabled && !resource.IsDisabledPrc){
				if (resource.Co2SourceTotal) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					lineItem.Co2SourceTotal! += resource.Co2SourceTotal;
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					lineItem.Co2SourceTotal = this.estimateMainRoundingService.doRoundingValue('QuantityTotal',lineItem.Co2SourceTotal!);
				}
				if (resource.Co2ProjectTotal) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					lineItem.Co2ProjectTotal! += resource.Co2ProjectTotal;
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					lineItem.Co2ProjectTotal = this.estimateMainRoundingService.doRoundingValue('QuantityTotal',lineItem.Co2ProjectTotal!);
				}
			}
		});

		lineItem.Co2TotalVariance = lineItem.Co2SourceTotal - lineItem.Co2ProjectTotal;
	}

	public calculateResourceLineItemCo2Project(resource: IEstResourceEntity, resourceList: IEstResourceEntity[]|null, lineItem: IEstLineItemEntity) {

		this.calculateResourceCo2Total(resource);
		function getChildrenResources(parentResource: IEstResourceEntity){
			if(parentResource && isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
				return parentResource.EstResources;
			}
			const children = resourceList?.filter(item => item.EstResourceFk === parentResource.Id);
			return uniqBy(children, 'Id');
		}

		return this.calculateLineItemResourceCo2(resource, lineItem, resourceList, getChildrenResources);
	}

	public calculateLineItemResourceCo2(resource: IEstResourceEntity, lineItem: IEstLineItemEntity,resList: IEstResourceEntity[]|null, getChildrenResources: getChildrenFunc) {
		if(!lineItem || !resList?.length){
			return;
		}
		if(resource.EstResourceFk!==null) {
			const findResourceParents = (res:IEstResourceEntity) => {
				const parent = find(resList, {Id: res.EstResourceFk}) as IEstResourceEntity;
				if (parent) {
					const children = getChildrenResources(parent);
					if (children && children.length) {
						this.calculateParentResourceCo2(parent, children);
						this.calculateResourceCo2Total(parent);
					}
					findResourceParents(parent);
				}
			};
			findResourceParents(resource);
		}
		// calculate LineItem Co2 (Sustainability)
		this.calculateLineItemCo2Total(lineItem, resList);
	}

	public calculateAdvancedAllowanceOfSubItem(resource: IEstResourceEntity, children: IEstResourceEntity[]|null) {
		resource.AdvancedAllowanceCostUnit = 0;

		if (resource.EstResourceTypeFk === 5) {
			if (!children || children.length === 0) {
				return;
			}

			resource.AdvancedAllowanceCostUnit = 0;

			children.forEach(child =>{
				if (!child.IsDisabled && !child.IsDisabledPrc && !child.IsInformation){
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					resource.AdvancedAllowanceCostUnit! += (child.AdvancedAllowanceCostUnitSubItem || 0);
				}
			});
			resource.AdvancedAllowanceCostUnit = this.estimateMainRoundingService.doRoundingValue('AdvancedAllowanceCostUnit',resource.AdvancedAllowanceCostUnit);
		} else if (resource.EstResourceTypeFk === 4) {
			resource.AdvancedAllowanceCostUnit = resource.CostUnit;
		}
	}

	public calculateCostOfResourceCore(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, parentResource: IEstResourceEntity|null, anscetorCostFactor: number = 1){
		if(!resource || !lineItem){
			return;
		}
		this.estimateMainRoundingService.roundInitialCosts(resource);
		this.estimateMainRoundingService.roundInitialCosts(lineItem);

		resource.CostFactorCc = !this.estimateMainResourceTypeService.isSubItemOrCompositeAssembly(resource) || !this.estimateMainResourceTypeService.isEquipmentAssembly(resource) ? resource.CostFactorCc : 1;

		resource.ExchangeRate = resource.ExchangeRate ? resource.ExchangeRate : 1;

		/* CostInternal = CostReal x (product of all cost factors from all parent levels above) */
		const parentCostFactor =  anscetorCostFactor;

		const costFactor = resource.CostFactor1 * resource.CostFactor2 * resource.CostFactorCc;

		resource.CostReal = resource.CostUnit * costFactor;
		resource.CostReal = this.estimateMainRoundingService.doRoundingValue('CostReal',resource.CostReal);

		resource.CostInternal = resource.CostReal * resource.ExchangeRate;

		// resource.CostInternal = !isSubItemOrCompositeAssembly(resource) ? resource.CostInternal * parentCostFactor : resource.CostInternal;
		resource.CostInternal = resource.CostInternal * parentCostFactor;
		resource.CostInternal = this.estimateMainRoundingService.doRoundingValue('CostInternal',resource.CostInternal);
		resource.CostUom = resource.CostInternal;

		/* CostUnitSubItem  = QuantityReal x CostInternal */
		resource.CostUnitSubItem = this.estimateMainResourceTypeService.isSubItemOrCompositeAssembly(resource) || this.estimateMainResourceTypeService.isEquipmentAssembly(resource) ? resource.CostInternal * lineItem.CostFactor1 * lineItem.CostFactor2 : resource.QuantityReal * resource.CostInternal;
		resource.CostUnitSubItem = this.estimateMainRoundingService.doRoundingValue('CostUnitSubItem',resource.CostUnitSubItem);

		/* CostUnitLineItem  = QuantityInternal x CostInternal */
		resource.CostUnitLineItem = resource.QuantityInternal * resource.CostInternal;
		resource.CostUnitLineItem = this.estimateMainRoundingService.doRoundingValue('CostUnitLineItem',resource.CostUnitLineItem);

		resource.EscResourceCostTotal =  resource.EscResourceCostUnit * resource.QuantityTotal * costFactor * lineItem.CostFactor1 * lineItem.CostFactor2;
		resource.EscResourceCostTotal = this.estimateMainRoundingService.doRoundingValue('EscResourceCostTotal',resource.EscResourceCostTotal);

		/* CostUnitTarget = QuantityUnitTarget x CostInternal */
		resource.CostUnitTarget = resource.QuantityUnitTarget * resource.CostInternal;
		resource.CostUnitTarget = this.estimateMainRoundingService.doRoundingValue('CostUnitTarget',resource.CostUnitTarget);

		resource.CostTotalInternal = parseFloat((resource.QuantityTotal * costFactor * resource.ExchangeRate * parentCostFactor * lineItem.CostFactor1 * lineItem.CostFactor2).toFixed(7));

		resource.CostUnitLineItemInternal = resource.QuantityInternal * costFactor * resource.ExchangeRate * parentCostFactor;

		/* CostTotal  = QuantityTotal x  CostInternal  x CostFactor1 (of parent Line Item) x CostFactor2 (of parent Line Item) */
		resource.CostTotal = resource.IsInformation ? 0 : (resource.QuantityTotal * resource.CostInternal * lineItem.CostFactor1 * lineItem.CostFactor2);
		resource.CostTotal = this.estimateMainRoundingService.doRoundingValue('CostTotal',resource.CostTotal);

		// Calculate Resource OriginalCurrency
		/* CostTotalOc  = QuantityTotal x  resource.CostReal  x CostFactor1 (of parent Line Item) x CostFactor2 (of parent Line Item) */
		resource.CostTotalOc =  resource.IsInformation ? 0 : !this.estimateMainResourceTypeService.isSubItemOrCompositeAssembly(resource) || !this.estimateMainResourceTypeService.isEquipmentAssembly(resource) ? (resource.QuantityTotal * resource.CostReal * lineItem.CostFactor1 * lineItem.CostFactor2): 0;
		resource.CostTotalOc =  this.estimateMainRoundingService.doRoundingValue('CostTotalOc',resource.CostTotalOc);

		resource.CostTotalCurrency =  resource.IsInformation ? 0 : this.estimateMainResourceTypeService.isSubItemOrCompositeAssembly(resource) || this.estimateMainResourceTypeService.isEquipmentAssembly(resource) ? resource.CostTotal : resource.QuantityTotal * resource.CostReal * parentCostFactor * lineItem.CostFactor1 * lineItem.CostFactor2;
		resource.CostTotalCurrency =  this.estimateMainRoundingService.doRoundingValue('CostTotalCurrency',resource.CostTotalCurrency);

		resource.HoursUnitSubItem = resource.QuantityReal * resource.HoursUnit * resource.HourFactor;
		resource.HoursUnitSubItem =  this.estimateMainRoundingService.doRoundingValue('HoursUnitSubItem',resource.HoursUnitSubItem);

		resource.HoursUnitLineItem = resource.QuantityInternal * resource.HoursUnit * resource.HourFactor;
		resource.HoursUnitLineItem =  this.estimateMainRoundingService.doRoundingValue('HoursUnitLineItem',resource.HoursUnitLineItem);

		resource.HoursUnitTarget = resource.QuantityUnitTarget * resource.HoursUnit * resource.HourFactor;
		resource.HoursUnitTarget =  this.estimateMainRoundingService.doRoundingValue('HoursUnitTarget',resource.HoursUnitTarget);

		resource.HoursTotal =  resource.IsInformation ? 0 : resource.QuantityTotal * resource.HoursUnit * resource.HourFactor;
		resource.HoursTotal = this.estimateMainRoundingService.doRoundingValue('HoursTotal',resource.HoursTotal);

		resource.DayWorkRateTotal =  resource.IsInformation ? 0 : resource.QuantityTotal * resource.DayWorkRateUnit * costFactor * parentCostFactor * resource.ExchangeRate * lineItem.CostFactor1 * lineItem.CostFactor2;
		resource.DayWorkRateTotal = this.estimateMainRoundingService.doRoundingValue('DayWorkRateTotal',resource.DayWorkRateTotal);

	}

	public calculateCostOfResource(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, parentResource: IEstResourceEntity|null, anscetorCostFactor: number = 1){
		if(!resource || !lineItem){
			return;
		}

		this.calculateCostOfResourceCore(resource, lineItem, parentResource, anscetorCostFactor);

		const costFactor = resource.CostFactor1 * resource.CostFactor2 * resource.CostFactorCc;

		/* CostInternal = CostReal x (product of all cost factors from all parent levels above) */
		const parentCostFactor = anscetorCostFactor;

		// MultiCurrency
		this.calCostInLocalCurrency(resource);

		/* if current resource is advanced allowance, then AdvancedAllowanceCostUnitLineItem equal CostUnitLineItem */
		if (this.estimateMainResourceTypeService.isAdvancedAllowanceCostCode(resource)) {
			const activeAllowance = this.estimateMainContextService.AllowanceEntity;

			if(resource.IsIndirectCost && activeAllowance){
				resource.AdvancedAllowanceCostUnit = (lineItem.AdvancedAllowance === 0 && lineItem.AdvancedAll !== 0) ? 0 : resource.CostUnit;
			}else {
				resource.AdvancedAllowanceCostUnit = 0;
			}
		}else{
			resource.AdvancedAllowanceCostUnit = resource.EstResourceTypeFk === 5 ? resource.AdvancedAllowanceCostUnit : 0;
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		resource.AdvancedAllowanceCostUnit = this.estimateMainRoundingService.doRoundingValue('AdvancedAllowanceCostUnit',resource.AdvancedAllowanceCostUnit!);

		resource.AdvancedAllowanceCostUnitSubItem = resource.QuantityReal * resource.AdvancedAllowanceCostUnit * costFactor * resource.ExchangeRate * (!this.estimateMainResourceTypeService.isSubItemOrCompositeAssembly(resource) || !this.estimateMainResourceTypeService.isEquipmentAssembly(resource) ? parentCostFactor : 1);
		resource.AdvancedAllowanceCostUnitSubItem = this.estimateMainRoundingService.doRoundingValue('AdvancedAllowanceCostUnitSubItem',resource.AdvancedAllowanceCostUnitSubItem);
		resource.AdvancedAllowanceCostUnitLineItem = resource.QuantityInternal * resource.AdvancedAllowanceCostUnit * costFactor * resource.ExchangeRate * (!this.estimateMainResourceTypeService.isSubItemOrCompositeAssembly(resource) || !this.estimateMainResourceTypeService.isEquipmentAssembly(resource) ? parentCostFactor : 1);
		resource.AdvancedAllowanceCostUnitLineItem = this.estimateMainRoundingService.doRoundingValue('AdvancedAllowanceCostUnitLineItem',resource.AdvancedAllowanceCostUnitLineItem);
	}



	/**
	 * initialize the costUnit of lineItem
	 * @param lineItem
	 */
	public initializeLineItemUnit(lineItem: IEstLineItemEntity) {
		if (!lineItem) {
			return;
		}

		lineItem.CostUnit = 0;

		lineItem.HoursUnit = 0;

		lineItem.EntCostUnit = 0;

		lineItem.EntHoursUnit = 0;

		lineItem.DruCostUnit = 0;

		lineItem.DruHoursUnit = 0;

		lineItem.DirCostUnit = 0;

		lineItem.DirHoursUnit = 0;

		lineItem.IndCostUnit = 0;

		lineItem.IndHoursUnit = 0;

		lineItem.AdvancedAllowanceCostUnit = 0;

		lineItem.MarkupCostUnit = 0;

		lineItem.DayWorkRateUnit = 0;

		lineItem.DayWorkRateTotal = 0;

		lineItem.AllowanceUnit = 0;

		lineItem.Co2SourceTotal = 0;

		lineItem.Co2ProjectTotal = 0;

		lineItem.EscalationCostUnit = 0;
	}

	/**
	 * calculate cost total, allowance and grand total of lineItem
	 * @param lineItem
	 * @param isTotalWq
	 */
	public calculateLineItemTotal(lineItem: IEstLineItemEntity, isTotalWq?: boolean):void {
		if (!lineItem) {
			return;
		}

		// check IsTotalWq flag of Estimate Type to consider AQ or WQ quantity target in calculation
		const qtyTarget = lineItem.IsLumpsum ? 1 : (isTotalWq ? lineItem.WqQuantityTarget : lineItem.QuantityTarget);

		lineItem.EntCostUnitTarget = lineItem.QuantityUnitTarget * lineItem.EntCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.EntCostUnitTarget = this.estimateMainRoundingService.doRoundingValue('EntCostUnitTarget',lineItem.EntCostUnitTarget);

		lineItem.EntCostTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.EntCostUnitTarget;
		lineItem.EntCostTotal = this.estimateMainRoundingService.doRoundingValue('EntCostTotal',lineItem.EntCostTotal);

		lineItem.EntHoursUnitTarget = lineItem.EntHoursUnit * lineItem.QuantityUnitTarget;
		lineItem.EntHoursUnitTarget = this.estimateMainRoundingService.doRoundingValue('EntHoursUnitTarget',lineItem.EntHoursUnitTarget);
		lineItem.EntHoursTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.EntHoursUnitTarget;
		lineItem.EntHoursTotal =  this.estimateMainRoundingService.doRoundingValue('EntHoursTotal',lineItem.EntHoursTotal);

		lineItem.DruCostUnitTarget = lineItem.QuantityUnitTarget * lineItem.DruCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.DruCostUnitTarget =  this.estimateMainRoundingService.doRoundingValue('DruCostUnitTarget',lineItem.DruCostUnitTarget);
		lineItem.DruCostTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.DruCostUnitTarget;
		lineItem.DruCostTotal = this.estimateMainRoundingService.doRoundingValue('DruCostTotal',lineItem.DruCostTotal);

		lineItem.DruHoursUnitTarget = lineItem.DruHoursUnit * lineItem.QuantityUnitTarget;
		lineItem.DruHoursUnitTarget = this.estimateMainRoundingService.doRoundingValue('DruHoursUnitTarget',lineItem.DruHoursUnitTarget );
		lineItem.DruHoursTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.DruHoursUnitTarget;
		lineItem.DruHoursTotal = this.estimateMainRoundingService.doRoundingValue('DruHoursTotal',lineItem.DruHoursTotal);

		lineItem.IndCostUnitTarget = lineItem.QuantityUnitTarget * lineItem.IndCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.IndCostUnitTarget = this.estimateMainRoundingService.doRoundingValue('IndCostUnitTarget',lineItem.IndCostUnitTarget);
		lineItem.IndCostTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.IndCostUnitTarget;
		lineItem.IndCostTotal =  this.estimateMainRoundingService.doRoundingValue('IndCostTotal',lineItem.IndCostTotal);

		lineItem.IndHoursUnitTarget = lineItem.IndHoursUnit * lineItem.QuantityUnitTarget;
		lineItem.IndHoursUnitTarget =  this.estimateMainRoundingService.doRoundingValue('IndHoursUnitTarget',lineItem.IndHoursUnitTarget);
		lineItem.IndHoursTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.IndHoursUnitTarget;
		lineItem.IndHoursTotal = this.estimateMainRoundingService.doRoundingValue('IndHoursTotal',lineItem.IndHoursTotal);

		lineItem.DirCostUnit = lineItem.EntCostUnit + lineItem.DruCostUnit;
		lineItem.DirCostUnit = this.estimateMainRoundingService.doRoundingValue('DirCostUnit',lineItem.DirCostUnit);
		lineItem.DirHoursUnit = lineItem.EntHoursUnit + lineItem.DruHoursUnit;
		lineItem.DirHoursUnit = this.estimateMainRoundingService.doRoundingValue('DirHoursUnit',lineItem.DirHoursUnit);

		lineItem.DirCostUnitTarget = lineItem.QuantityUnitTarget * lineItem.DirCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.DirCostUnitTarget =  this.estimateMainRoundingService.doRoundingValue('DirCostUnitTarget',lineItem.DirCostUnitTarget);
		lineItem.DirCostTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.DirCostUnitTarget;
		lineItem.DirCostTotal =  this.estimateMainRoundingService.doRoundingValue('DirCostTotal',lineItem.DirCostTotal);

		lineItem.DirHoursUnitTarget = lineItem.DirHoursUnit * lineItem.QuantityUnitTarget;
		lineItem.DirHoursUnitTarget = this.estimateMainRoundingService.doRoundingValue('DirHoursUnitTarget',lineItem.DirHoursUnitTarget);
		lineItem.DirHoursTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.DirHoursUnitTarget;
		lineItem.DirHoursTotal = this.estimateMainRoundingService.doRoundingValue('DirHoursTotal',lineItem.DirHoursTotal);

		lineItem.CostUnit = lineItem.DirCostUnit + lineItem.IndCostUnit;
		lineItem.CostUnit =  this.estimateMainRoundingService.doRoundingValue('CostUnit',lineItem.CostUnit);
		lineItem.HoursUnit = lineItem.DirHoursUnit + lineItem.IndHoursUnit;
		lineItem.HoursUnit = this.estimateMainRoundingService.doRoundingValue('HoursUnit',lineItem.HoursUnit);

		lineItem.CostUnitTarget = lineItem.QuantityUnitTarget * lineItem.CostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.CostUnitTarget = this.estimateMainRoundingService.doRoundingValue('CostUnitTarget',lineItem.CostUnitTarget);
		lineItem.CostTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.CostUnitTarget;
		lineItem.CostTotal = this.estimateMainRoundingService.doRoundingValue('CostTotal',lineItem.CostTotal);

		lineItem.HoursUnitTarget = lineItem.HoursUnit * lineItem.QuantityUnitTarget;
		lineItem.HoursUnitTarget = this.estimateMainRoundingService.doRoundingValue('HoursUnitTarget',lineItem.HoursUnitTarget);
		lineItem.HoursTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.HoursUnitTarget;
		lineItem.HoursTotal = this.estimateMainRoundingService.doRoundingValue('HoursTotal',lineItem.HoursTotal);

		/* calculate AdvancedAllowance */
		lineItem.AdvancedAllowance = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.QuantityUnitTarget * lineItem.AdvancedAllowanceCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.AdvancedAllowance = this.estimateMainRoundingService.doRoundingValue('AdvancedAllowance',lineItem.AdvancedAllowance);

		/* calculate Margin */
		lineItem.MarkupCostUnitTarget = lineItem.QuantityUnitTarget * lineItem.MarkupCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.MarkupCostUnitTarget = this.estimateMainRoundingService.doRoundingValue('MarkupCostUnitTarget',lineItem.MarkupCostUnitTarget);
		lineItem.MarkupCostTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.MarkupCostUnitTarget;
		lineItem.MarkupCostTotal = this.estimateMainRoundingService.doRoundingValue('MarkupCostTotal',lineItem.MarkupCostTotal);

		/* calculate Escalation */
		lineItem.EscalationCostTotal = lineItem.EscalationCostUnit * qtyTarget * lineItem.QuantityUnitTarget * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.EscalationCostTotal = this.estimateMainRoundingService.doRoundingValue('EscalationCostTotal',lineItem.EscalationCostTotal);

		/* calculate AdvancedAll and ManualMarkup */
		lineItem.AdvancedAllUnitItem = lineItem.QuantityUnitTarget * lineItem.AdvancedAllUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.AdvancedAllUnitItem =  this.estimateMainRoundingService.doRoundingValue('AdvancedAllUnitItem',lineItem.AdvancedAllUnitItem);
		lineItem.AdvancedAll = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.AdvancedAllUnitItem;
		lineItem.AdvancedAll = this.estimateMainRoundingService.doRoundingValue('AdvancedAll',lineItem.AdvancedAll);

		lineItem.ManualMarkupUnitItem = lineItem.QuantityUnitTarget * lineItem.ManualMarkupUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.ManualMarkupUnitItem = this.estimateMainRoundingService.doRoundingValue('ManualMarkupUnitItem', lineItem.ManualMarkupUnitItem);
		lineItem.ManualMarkup = qtyTarget * lineItem.ManualMarkupUnitItem; // + URD
		lineItem.ManualMarkup = this.estimateMainRoundingService.doRoundingValue('ManualMarkup', lineItem.ManualMarkup);


		/* set the standard grandtotal as 0, while the line item is GC */
		lineItem.StandardGrandCostUnit = lineItem.IsGc || lineItem.IsIncluded ? 0 : lineItem.CostUnit + lineItem.MarkupCostUnit + lineItem.AllowanceUnit;
		lineItem.StandardGrandCostUnit = this.estimateMainRoundingService.doRoundingValue('GrandCostUnit',lineItem.StandardGrandCostUnit);
		lineItem.StandardGrandCostUnitTarget = lineItem.IsGc || lineItem.IsIncluded ? 0 : lineItem.QuantityUnitTarget * lineItem.StandardGrandCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
		lineItem.StandardGrandCostUnitTarget = this.estimateMainRoundingService.doRoundingValue('GrandCostUnitTarget',lineItem.StandardGrandCostUnitTarget);
		lineItem.StandardGrandTotal = lineItem.IsGc || lineItem.IsIncluded || (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : (qtyTarget * lineItem.StandardGrandCostUnitTarget);
		lineItem.StandardGrandTotal =  this.estimateMainRoundingService.doRoundingValue('GrandTotal',lineItem.StandardGrandTotal);

		/* set the grandTotal as 0, while the line item is GC */
		if(lineItem.IsFixedPrice){
			lineItem.GrandCostUnitTarget = this.estimateMainRoundingService.doRoundingValue('GrandCostUnitTarget',lineItem.GrandCostUnitTarget);
			const quantityTargetFactor = lineItem.QuantityUnitTarget * lineItem.CostFactor1 * lineItem.CostFactor2;
			lineItem.GrandCostUnit = !quantityTargetFactor ? 0 : lineItem.GrandCostUnitTarget / quantityTargetFactor;
			lineItem.GrandCostUnit = this.estimateMainRoundingService.doRoundingValue('GrandCostUnit',lineItem.GrandCostUnit);
		}else{
			lineItem.GrandCostUnit = lineItem.StandardGrandCostUnit;
			lineItem.GrandCostUnit = this.estimateMainRoundingService.doRoundingValue('GrandCostUnit',lineItem.GrandCostUnit);
			lineItem.GrandCostUnitTarget = lineItem.IsGc || lineItem.IsIncluded ? 0 : lineItem.QuantityUnitTarget * lineItem.GrandCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
			lineItem.GrandCostUnitTarget = this.estimateMainRoundingService.doRoundingValue('GrandCostUnitTarget',lineItem.GrandCostUnitTarget);
		}

		lineItem.GrandTotal = lineItem.IsGc || lineItem.IsIncluded || (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : (qtyTarget * lineItem.GrandCostUnitTarget);
		lineItem.GrandTotal = this.estimateMainRoundingService.doRoundingValue('GrandTotal',lineItem.GrandTotal);

		/* calculate URD */
		lineItem.URD = parseFloat(lineItem.GrandTotal.toFixed(6)) - parseFloat(lineItem.StandardGrandTotal.toFixed(6));
		lineItem.URDUnitItem = parseFloat(lineItem.GrandCostUnitTarget.toFixed(6)) - parseFloat(lineItem.StandardGrandCostUnitTarget.toFixed(6));

		/* calculate Margin */
		lineItem.Margin1 = (lineItem.IsOptional && !lineItem.IsOptionalIT) || lineItem.IsGc ? 0 : lineItem.Revenue > 0 ? lineItem.Revenue - lineItem.CostTotal - lineItem.Gc : 0;
		lineItem.Margin1 = this.estimateMainRoundingService.doRoundingValue('Margin1',lineItem.Margin1);
		lineItem.Margin2 = lineItem.IsOptional && !lineItem.IsOptionalIT ? 0 : lineItem.Revenue > 0 ? lineItem.Revenue - lineItem.GrandTotal : 0;
		lineItem.Margin2 = this.estimateMainRoundingService.doRoundingValue('Margin2',lineItem.Margin2 );
	}
}