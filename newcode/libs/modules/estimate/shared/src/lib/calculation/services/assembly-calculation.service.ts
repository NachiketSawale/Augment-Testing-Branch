/**
 * Copyright (c) RIB Software SE
 */

import { uniqBy } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { EstimateMainRoundingService } from '../../common/services/rounding/estimate-main-rounding.service';
import { EstimateMainResourceTypeService } from '../../common/services/estimate-main-resource-type.service';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateMainCompleteCalculationService } from './estimate-main-complete-calculation.service';
import { AssemblyTypeDataService } from '../../common/services/assembly-type-data.service';
import { EstimateMainResourceType } from '../../common/enums/estimate-main-resource-type.enum';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ResourceQuantityCalculationService } from './resource-quantity-calculation.service';
import { getChildrenFunc } from '../../calculation/model/interfaces/resource-children-function.interface';

/**
 * AssemblyCalculationService
 * mapping to estimateAssembliesCalculationService
 */
@Injectable({
	providedIn: 'root',
})
export class AssemblyCalculationService{
	private http = inject(HttpClient);
	private platformConfigurationService = inject(PlatformConfigurationService);
	private estimateMainRoundingService = inject(EstimateMainRoundingService);
	private readonly resourceTypeService = inject(EstimateMainResourceTypeService);
	private readonly estimateMainCompleteCalculationService = inject(EstimateMainCompleteCalculationService);
	private readonly assemblyTypeDataService = inject(AssemblyTypeDataService);
	private readonly resourceQuantityCalculationService = inject(ResourceQuantityCalculationService);

	private cacheIds : number[] = [];
	private compositeAssemblyWithDetailResources : IEstLineItemEntity[] = [];

	/**
	 * calculate costTotal of lineItem and its resources
	 * @param lineItem
	 * @param resources
	 */
	public calculateLineItemAndResources(lineItem: IEstLineItemEntity, resources: IEstResourceEntity[]){
		/* validate lineItem is not null */
		if(!lineItem) {
			return;
		}
		/* calculate quantity of lineItem */
		this.calculateQuantityOfLineItem(lineItem);

		/* calculate quantity and cost of resources */
		this.updateResources(lineItem, resources);

		/* calculate cost and hour of lineItem */
		this.calculateLineItemTotal(lineItem, resources);

		/* calculate user defined column value in lineItem and resource */
		//TODO: UDP calculation move to other service
		// let userDefinedColumnService = $injector.get('projectAssemblyMainService').getIsPrjAssembly() ? $injector.get('projectAssemblyDynamicUserDefinedColumnService') : ($injector.get('projectAssemblyMainService').getIsPrjPlantAssembly() ? $injector.get('projectPlantAssemblyDynamicUserDefinedColumnService') : $injector.get('estimateAssembliesDynamicUserDefinedColumnService'));
		// userDefinedColumnService.calculate(lineItem, resources);
	}

	/**
	 * calculate costTotal of resources
	 * @param lineItem
	 * @param resourceList
	 */
	public updateResources(lineItem: IEstLineItemEntity, resourceList: IEstResourceEntity[]){
		this.updateResourceOfAssemblyCore(lineItem, resourceList, this.createGetChildrenFunc(resourceList));
	}

	/**
	 * calculate current resource and its children.
	 * @param resource
	 * @param lineItem
	 * @param resources
	 */
	public calculateResource(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, resources: IEstResourceEntity[]){
		/* calculate resources */
		const resourcesChanged = this.calculateResourceCore(resource, lineItem, resources);

		/* calculate cost and hour of lineItem */
		this.calculateLineItemTotal(lineItem, resources);

		/* calculate user defined column value in resource  */
		//TODO: calculate UDP move to other service
		// let resourceUserDefinedColumnService = $injector.get('projectAssemblyMainService').getIsPrjAssembly() ? $injector.get('projectAssemblyResourceDynamicUserDefinedColumnService') : $injector.get('projectAssemblyMainService').getIsPrjPlantAssembly() ? $injector.get('projectPlantAssemblyResourceDynamicUserDefinedColumnService') : $injector.get('estimateAssembliesResourceDynamicUserDefinedColumnService');
		// resourceUserDefinedColumnService.calculate(lineItem, resource, resources);

		return resourcesChanged;
	}

	/**
	 * calculate resource and its children and its parent
	 * @param resource
	 * @param lineItem
	 * @param resourceList
	 */
	public updateResourceOfAssembly(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, resourceList: IEstResourceEntity[]){
		let retValue: IEstResourceEntity[] = [];
		if(!resource || resource.Id <= 0){
			return retValue;
		}
		if(!lineItem || !resourceList){
			return retValue;
		}
		const rootParent = this.getRootParent(resource, resourceList);
		retValue = this.calculateResourceTree(rootParent, lineItem, this.createGetChildrenFunc(resourceList), null, 1);
		// calculate LineItem Co2 (Sustainability)
		this.estimateMainCompleteCalculationService.calculateLineItemCo2Total(lineItem, resourceList);
		return retValue;
	}

	/**
	 * calculate quantity of assembly item
	 * @param lineItem
	 */
	public calculateQuantityOfLineItem(lineItem: IEstLineItemEntity){
		if(!lineItem){
			return;
		}
		const quantityTarget = 1;
		if(lineItem.IsDisabled){
			lineItem.QuantityUnitTarget = 0;
			lineItem.QuantityTotal = quantityTarget * lineItem.QuantityUnitTarget;
		} else {
			// if the type of item.Quantity isn't [object Number],such as [object Object]
			lineItem.Quantity = (Object.prototype.toString.call(lineItem.Quantity) === '[object Number]') ? lineItem.Quantity : 1;
			this.estimateMainRoundingService.roundInitialQuantities(lineItem);

			lineItem.QuantityUnitTarget = (lineItem.Quantity * lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor);
			this.doRoundingValues(['QuantityUnitTarget'], lineItem);

			const qtyTarget = lineItem.IsLumpsum ? 1: quantityTarget;
			lineItem.QuantityTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : qtyTarget * lineItem.QuantityUnitTarget;
			this.doRoundingValues(['QuantityTotal'], lineItem);
		}
	}

	/**
	 * sum up resources costTotal to lineItem, and calculate lineItem costTotal
	 * @param lineItem
	 * @param resources
	 * @private
	 */
	private calculateLineItemTotal(lineItem: IEstLineItemEntity, resources: IEstResourceEntity[]){
		if(!lineItem) {
			return;
		}
		this.estimateMainCompleteCalculationService.initializeLineItemUnit(lineItem);
		if(resources){
			const resourceTreeOfFirstLevel = resources.filter(e => e.EstResourceFk === null);
			this.sumResourcesTotalToLineItem(lineItem, resourceTreeOfFirstLevel, this.createGetChildrenFunc(resources));
		}
		this.estimateMainCompleteCalculationService.calculateLineItemTotal(lineItem);

		// calculate LineItem Co2 (Sustainability)
		this.estimateMainCompleteCalculationService.calculateLineItemCo2Total(lineItem, resources);
	}

	/**
	 * sum up resources costTotal to lineItem
	 * @param lineItem
	 * @param resources
	 * @param getChildrenFunc
	 * @private
	 */
	private sumResourcesTotalToLineItem(lineItem: IEstLineItemEntity, resources: IEstResourceEntity[], getChildrenFunc: getChildrenFunc) {
		if (!lineItem || !resources || !getChildrenFunc) {
			return;
		}

		resources.forEach(item => {
			if(this.resourceTypeService.isAssembly(item)){
				if (item.EstAssemblyTypeFk && this.resourceTypeService.isCompositeAssembly(item)) {
					const isPaAssembly = this.assemblyTypeDataService.isPaAssembly(item.EstAssemblyTypeFk);
					if (isPaAssembly) {
						this.sumAssemblyResourceTotalToLineItem(lineItem, item);
					} else {
						this.sumSingleResourceTotalToLineItem(lineItem, item);
					}
				} else {
					// ALM 113372 get assembly resources in detail to consider cost based on IsCost Flag on it
					this.sumAssemblyResourceTotalToLineItem(lineItem, item);
				}
			}else{
				const children = getChildrenFunc(item);
				if (!children || !children.length) {
					this.sumSingleResourceTotalToLineItem(lineItem, item);
				} else {
					this.sumResourcesTotalToLineItem(lineItem, children, getChildrenFunc);
				}
			}
		});
	}

	private sumAssemblyResourceTotalToLineItem(lineItem: IEstLineItemEntity, resource: IEstResourceEntity){
		if (!lineItem || !resource) {
			return;
		}

		const markupCostUnitLineItem = resource.MarkupCostUnitLineItem ? resource.MarkupCostUnitLineItem : 0;

		if (resource.IsIndirectCost) {
			lineItem.IndCostUnit += (resource.CostUnitLineItem - markupCostUnitLineItem);
			lineItem.IndHoursUnit += (resource.HoursUnitLineItem ?? 0);
		} else {
			lineItem.EntCostUnit += (resource.CostUnitLineItem - markupCostUnitLineItem);
			lineItem.EntHoursUnit += (resource.HoursUnitLineItem ?? 0);
		}

		lineItem.MarkupCostUnit += markupCostUnitLineItem;
		lineItem.DayWorkRateUnit += resource.IsCost ? resource.DayWorkRateUnit : 0;
		lineItem.DayWorkRateTotal += lineItem.IsGc || lineItem.IsIncluded || !resource.IsCost ? 0 : resource.DayWorkRateTotal;
	}

	private sumSingleResourceTotalToLineItem(lineItem: IEstLineItemEntity, resource: IEstResourceEntity) {
		if (!lineItem || !resource || resource.IsInformation) {
			return;
		}
		if (resource.IsCost) {
			if (resource.IsIndirectCost) {
				// calculate indirect cost unit(consider resource isIndirect flag true, Ind)
				lineItem.IndCostUnit += resource.CostUnitLineItem;
				lineItem.IndHoursUnit += (resource.HoursUnitLineItem ?? 0);
			} else {
				if (resource.EstRuleSourceFk /* && !res.IsEstimateCostCode && res.IsRuleMarkupCostCode */) {
					// calculate direct rule cost unit(consider resource created from rule and isIndirect flag false, Dru)
					lineItem.DruCostUnit += resource.CostUnitLineItem;
					lineItem.DruHoursUnit += (resource.HoursUnitLineItem ?? 0);
				} else {
					// ALM 107101 new changes(like old logic) and ALM 107748
					// calculate entered cost unit(consider resource not created from rule, Ent)
					lineItem.EntCostUnit += resource.CostUnitLineItem;
					lineItem.EntHoursUnit += (resource.HoursUnitLineItem ?? 0);
				}
			}
			resource.CostUnitLineItemInternal = resource.CostUnitLineItemInternal || 1;
			lineItem.DayWorkRateUnit += resource.DayWorkRateUnit * resource.CostUnitLineItemInternal;
			lineItem.DayWorkRateTotal += lineItem.IsGc || lineItem.IsIncluded ? 0 : resource.DayWorkRateTotal;
		} else {
			lineItem.MarkupCostUnit += resource.CostUnitLineItem;
		}
	}

	private getAssemblyLineItem(compoAssemblyResource: IEstResourceEntity) : IEstLineItemEntity | null | undefined{
		if (compoAssemblyResource && compoAssemblyResource.EstResourceTypeFk === EstimateMainResourceType.Assembly) {
			return this.compositeAssemblyWithDetailResources.find(e => e.Id === compoAssemblyResource.EstAssemblyFk);
		}
		return null;
	}

	public updateResourceOfAssemblyCore(lineItem: IEstLineItemEntity, resourceList: IEstResourceEntity[], getChildrenResources: getChildrenFunc){
		if(!lineItem || !resourceList){
			return;
		}
		const resourceTree = resourceList.filter(e => e.EstResourceFk === null);
		/*
		* calculate quantity of resource tree
		* */
		resourceTree.forEach(resource => {
			this.calculateResourceTree(resource, lineItem, getChildrenResources, null,1);
		});

		// calculate LineItem Co2 (Sustainability)
		this.estimateMainCompleteCalculationService.calculateLineItemCo2Total(lineItem, resourceList);
	}

	private calculateCostOfResourceCore(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, parentResource: IEstResourceEntity|null, anscetorCostFactor:number = 1){
		if(!resource || !lineItem){
			return;
		}

		resource.CostFactorCc = !this.resourceTypeService.isSubItem(resource) || !this.resourceTypeService.isEquipmentAssembly(resource) ? resource.CostFactorCc : 1;
		resource.ExchangeRate = resource.ExchangeRate ? resource.ExchangeRate : 1;

		/* CostInternal = CostReal x (product of all cost factors from all parent levels above) */
		const parentCostFactor = anscetorCostFactor;
		const costFactor = resource.CostFactor1 * resource.CostFactor2 * resource.CostFactorCc;

		resource.CostReal = resource.CostUnit * costFactor;
		this.doRoundingValues(['CostReal'], resource);

		resource.CostInternal = resource.CostReal * resource.ExchangeRate;
		this.doRoundingValues(['CostInternal'], resource);

		// resource.CostInternal = !estimateMainCompleteCalculationService.isSubItem(resource) ? resource.CostInternal * parentCostFactor : resource.CostInternal;
		resource.CostInternal = resource.CostInternal * parentCostFactor;

		resource.CostUom = resource.CostInternal;
		this.doRoundingValues(['CostUom'], resource);

		/* CostUnitSubItem  = QuantityReal x CostInternal */
		resource.CostUnitSubItem = resource.QuantityReal * resource.CostInternal;
		this.doRoundingValues(['CostUnitSubItem'], resource);

		resource.CostTotalInternal = Number((resource.QuantityTotal * costFactor * resource.ExchangeRate * parentCostFactor * lineItem.CostFactor1 * lineItem.CostFactor2).toFixed(7));
		resource.CostUnitLineItemInternal = resource.QuantityInternal * costFactor * resource.ExchangeRate * parentCostFactor;

		/* CostUnitLineItem  = QuantityInternal x CostInternal */
		resource.CostUnitLineItem = resource.QuantityInternal * resource.CostInternal;
		this.doRoundingValues(['CostUnitLineItem'], resource);

		/* CostUnitTarget = QuantityUnitTarget x CostInternal */
		resource.CostUnitTarget = resource.QuantityUnitTarget * resource.CostInternal;
		this.doRoundingValues(['CostUnitTarget'], resource);

		/* CostTotal  = QuantityTotal x  CostInternal  x CostFactor1 (of parent Line Item) x CostFactor2 (of parent Line Item) */
		resource.CostTotal =  resource.IsInformation ? 0 : resource.QuantityTotal * resource.CostInternal * lineItem.CostFactor1 * lineItem.CostFactor2;
		this.doRoundingValues(['CostTotal'], resource);

		resource.CostTotalCurrency = resource.IsInformation ? 0 : this.resourceTypeService.isSubItem(resource) || this.resourceTypeService.isEquipmentAssembly(resource) ? resource.CostTotal : resource.QuantityTotal * resource.CostReal * parentCostFactor * lineItem.CostFactor1 * lineItem.CostFactor2;
		this.doRoundingValues(['CostTotalCurrency'], resource);

		resource.HoursUnitSubItem = resource.QuantityReal * resource.HoursUnit * resource.HourFactor;
		this.doRoundingValues(['HoursUnitSubItem'], resource);

		resource.HoursUnitLineItem = resource.QuantityInternal * resource.HoursUnit * resource.HourFactor;
		this.doRoundingValues(['HoursUnitLineItem'], resource);

		resource.HoursUnitTarget = resource.QuantityUnitTarget * resource.HoursUnit * resource.HourFactor;
		this.doRoundingValues(['HoursUnitTarget'], resource);

		resource.HoursTotal = resource.IsInformation ? 0 : resource.QuantityTotal * resource.HoursUnit * resource.HourFactor;
		this.doRoundingValues(['HoursTotal'], resource);

		/* MarkupCostUnit and MarkupCostUnitLineItem */
		if(this.resourceTypeService.isNormalAssembly(resource) || (resource.EstAssemblyTypeFk && this.assemblyTypeDataService.isPaAssembly(resource.EstAssemblyTypeFk))){
			const normalAssembly = this.getAssemblyLineItem(resource);
			resource.MarkupCostUnit = normalAssembly && normalAssembly.MarkupCostUnit ? normalAssembly.MarkupCostUnit : 0;
		}else if(this.resourceTypeService.isSubItem(resource) || this.resourceTypeService.isEquipmentAssembly(resource)){
			resource.MarkupCostUnit = resource.MarkupCostUnit ? resource.MarkupCostUnit : 0;
		}else{
			resource.MarkupCostUnit = 0;
		}
		this.doRoundingValues(['MarkupCostUnit'], resource);

		resource.MarkupCostUnitLineItem = resource.QuantityInternal * (resource.MarkupCostUnit??0) * costFactor * resource.ExchangeRate * anscetorCostFactor;
		this.doRoundingValues(['MarkupCostUnitLineItem'], resource);

		resource.DayWorkRateTotal = resource.IsInformation ? 0 : resource.QuantityTotal * resource.DayWorkRateUnit * costFactor * parentCostFactor * resource.ExchangeRate * lineItem.CostFactor1 * lineItem.CostFactor2;
		this.doRoundingValues(['DayWorkRateTotal'], resource);
	}

	public calculateResourceTree(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, getChildrenFunc: getChildrenFunc, parentResource: IEstResourceEntity|null, anscetorCostFactor:number = 1){
		let retValue = [resource];
		this.resourceQuantityCalculationService.calculateQuantityOfResource(resource, lineItem, parentResource);

		/* subItem */
		if(this.resourceTypeService.isSubItem(resource) || this.resourceTypeService.isEquipmentAssembly(resource)){
			const children = getChildrenFunc(resource);
			if(children && children.length){
				/* calculate anscetor costFactor */
				const costFactor = anscetorCostFactor * resource.CostFactor1 * resource.CostFactor2;
				children.forEach(child => {
					const childrenChanged = this.calculateResourceTree(child, lineItem, getChildrenFunc, resource, costFactor);
					if(childrenChanged && childrenChanged.length){
						retValue = retValue.concat(childrenChanged);
					}
				});

				/* the costUnit of subItem equal the sum of its children's cost/Unit subItem */
				this.calculateCostUnitOfSubItem(resource, children);

				// calculate Parent Resource Co2 (Sustainability)
				this.estimateMainCompleteCalculationService.calculateParentResourceCo2(resource, children);

				if(resource.Version === 0){
					resource.QuantityOriginal = resource.Quantity;
					resource.CostUnitOriginal = resource.CostUnit;
				}
			}else {
				resource.CostUnit = 0;
				resource.HoursUnit = 0;
				resource.DayWorkRateUnit = 0;
				resource.Co2Source = 0;
				resource.Co2Project = 0;
			}
		}
		this.calculateCostOfResourceCore(resource, lineItem, parentResource, anscetorCostFactor);
		this.estimateMainCompleteCalculationService.calculateResourceCo2Total(resource);
		return retValue;
	}

	private calculateResourceCore(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, resources: IEstResourceEntity[]){
		let retValue : IEstResourceEntity[] = [];
		if(!resource || !lineItem || !resources){
			return retValue;
		}
		const getChildrenResources = this.createGetChildrenFunc(resources);

		/* collect ancestors */
		const ancestors:IEstResourceEntity[] = [];
		let currentResource : IEstResourceEntity | undefined = resource;
		while(currentResource && currentResource.EstResourceFk){
			currentResource = resources.find(e => e.Id === currentResource!.EstResourceFk);
			if(currentResource){
				ancestors.push(currentResource);
			}
		}

		/* calculate current resource and its children */
		const resourceChanged = this.calculateResourceTree(resource, lineItem, this.createGetChildrenFunc(resources), this.estimateMainCompleteCalculationService.getParent(ancestors), this.estimateMainCompleteCalculationService.getAncestorsCostFactor(ancestors));
		if(resourceChanged && resourceChanged.length){
			retValue = retValue.concat(resourceChanged);
		}

		/* calculate ancestors */
		while (ancestors.length > 0){
			const currentItem = ancestors.shift();
			if(currentItem){
				if(this.resourceTypeService.isSubItem(currentItem) || this.resourceTypeService.isEquipmentAssembly(currentItem)){
					const children = getChildrenResources(currentItem);
					if(children && children.length){
						/* the costUnit of subItem equal the sum of its children's cost/Unit subItem */
						this.calculateCostUnitOfSubItem(currentItem, children);
						this.estimateMainCompleteCalculationService.calculateParentResourceCo2(currentItem, children);
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
				this.calculateCostOfResourceCore(currentItem, lineItem, this.estimateMainCompleteCalculationService.getParent(ancestors), this.estimateMainCompleteCalculationService.getAncestorsCostFactor(ancestors));
				this.estimateMainCompleteCalculationService.calculateResourceCo2Total(resource);
				retValue.push(currentItem);
			}
		}
		return retValue;
	}

	private calculateCostUnitOfSubItem(resource: IEstResourceEntity, children: IEstResourceEntity[]){
		resource.CostUnit = 0;
		resource.HoursUnit = 0;
		resource.MarkupCostUnit = 0;
		resource.DayWorkRateUnit = 0;

		children.forEach(child =>{
			if(!child.IsDisabled && !child.IsDisabledPrc && !child.IsInformation){
				resource.CostUnit += child.CostUnit * child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1);
				resource.MarkupCostUnit = (resource.MarkupCostUnit ?? 0) + ((child.MarkupCostUnit ?? 0) * child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1));
				resource.HoursUnit += child.HoursUnit * child.QuantityReal * child.HourFactor;
				resource.DayWorkRateUnit += child.DayWorkRateUnit * child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1);
			}
		});
		this.doRoundingValues(['CostUnit', 'MarkupCostUnit', 'HoursUnit', 'DayWorkRateUnit'], resource);
	}

	private getRootParent(resource: IEstResourceEntity, resourceList: IEstResourceEntity[]){
		if(!resource.EstResourceFk){
			return resource;
		}
		let parent = resourceList.find(e => e.Id === resource.EstResourceFk);
		while(parent && parent.EstResourceFk){
			parent = resourceList.find(e => e.Id === parent!.EstResourceFk);
		}
		return parent ? parent : resource;
	}

	private doRoundingValues<T extends object>(fields: string[], item: T){
		if(!item || !fields || !fields.length){
			return;
		}
		return this.estimateMainRoundingService.doRoundingValues(fields, item);
	}

	private createGetChildrenFunc(resourceList: IEstResourceEntity[]){
		return function getChildrenResources(parentResource: IEstResourceEntity){
			if(parentResource && parentResource.EstResources && parentResource.EstResources.length > 0){
				return parentResource.EstResources;
			}
			const children = resourceList.filter(e => e.EstResourceFk === parentResource.Id);
			return uniqBy(children, 'Id');
		};
	}

	public loadCompositeAssemblyResources(items : IEstResourceEntity[] | null): Promise<IEstLineItemEntity[]> {
		if (!items || !items.length) {
			return Promise.resolve([]);
		}
		const assemblies = items.filter(item => item.EstAssemblyFk !== null);
		const assemblyIds = assemblies.filter(e => e.EstAssemblyFk).map(e => e.EstAssemblyFk) as number[];
		const estHeaderId = items[0].EstHeaderFk;
		if (assemblyIds.length <= 0) {
			return Promise.resolve([]);
		}

		if (this.cacheIds.length > 0){
			let hasCache = true;
			for(let i=0; i<assemblyIds.length; i++){
				if (this.cacheIds.indexOf(assemblyIds[i]) === -1){
					hasCache = false;
					this.cacheIds.push(assemblyIds[i]);
				}
			}
			if (hasCache){
				return Promise.resolve([]);
			}
		} else {
			this.cacheIds = this.cacheIds.concat(assemblyIds);
		}

		const postData = {
			EstHeaderId: estHeaderId,
			AssemblyIds: assemblyIds
		};
		return new Promise<IEstLineItemEntity[]>(resolve => {
			this.http.post<IEstLineItemEntity[]>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/lineitem/getassemblywithresourcesdetail', postData).subscribe((response) => {
				this.compositeAssemblyWithDetailResources = response;
				resolve(response);
			});
		});
	}

	public calculateResourceOfAssembly(resource: IEstResourceEntity, lineItem:IEstLineItemEntity, resources : IEstResourceEntity[] | null, assemblyType:string) : IEstResourceEntity[] {
		// TODO
		// /* calculate resources */
		// let resourcesChanged = calculateResourceCoreOfAssembly(resource, lineItem, resources);

		// /* calculate cost and hour of lineItem */
		// calculateLineItemTotal(lineItem, resources);

		// /* calculate user defined column value in resource  */
		// getResourceUserDefinedColumnService(assemblyType).calculate(lineItem, resource, resources);

		// return resourcesChanged;

		return [];
	}
}