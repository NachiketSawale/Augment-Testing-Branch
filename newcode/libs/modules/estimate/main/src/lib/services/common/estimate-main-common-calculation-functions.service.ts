/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEstTotalCost } from '../../model/interfaces/estimate-main-common.interface';
import { IPrjMaterialEntity } from '@libs/project/interfaces';
import { AssemblyTypeDataService, BudgetCalculationService, EstimateMainCompleteCalculationService, EstimateMainContextService, EstimateMainResourceTypeService, EstimateMainRoundingService, MultiCurrencyCommonService } from '@libs/estimate/shared';
import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { IPrjCostCodesEntity } from '@libs/project/interfaces';
import { EstimateMainResourceProcessService } from '../../containers/resource/estimate-main-resource-process.service';
import { EntityRuntimeData } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})

/**
 * This service is for common calculation function used in EstimateMainCommonService
 */
export class EstimateMainCommonCalculationFunctionService {
	private estDetailCalServ = null; //inject(EstimateMainDetailCalculationService);
	private completeCalculationServ = inject(EstimateMainCompleteCalculationService);
	private resourceTypeService = inject(EstimateMainResourceTypeService);
	private roundingServ = inject(EstimateMainRoundingService);
	private estimateMainContextService = inject(EstimateMainContextService);
	private readonly budgetCalculationService = inject(BudgetCalculationService);
	//TODO: circle reference with EstimateMainService
	//estimateMainServ = inject(EstimateMainService);	
	//basicLookupDescriptiorServ = null; // inject(basicsLookupdataLookupDescriptorService);
	//estimateMainConfigDetailService = null; // inject(EstimateMainConfigDetailService);
	//resDynamicUserDefinedServ = null; //inject(EstimateMainResourceDynamicUserDefinedColumnService);
	//estDynamicUserDefinedServ = null; //inject(EstimateMainDynamicUserDefinedColumnService);
	private estMainColumnconfig = null; //inject(EstimateMainColumnConfigService);
	private total: IEstTotalCost = { TotalCost: 0, TotalCostRisk: 0, TotalHours: 0, MajorCostCode: [], MajorCostTotal: 0, IsValid: false };
	private readonly resProcessor!: EstimateMainResourceProcessService;
	private readonly assemblyTypeDataService = inject(AssemblyTypeDataService);
	private readonly estMulCurrency = inject(MultiCurrencyCommonService);

	/**
	 * CalculateDetails function provides calculation for details column
	 * @param item Item to be calculated
	 * @param colName Column name
	 * @param dataService Dataservice of the item
	 * @param ignoreCalculateDetail To ignore calculation
	 */
	public calculateDetails<T, U>(item: T, colName: string, dataService: U, ignoreCalculateDetail: boolean): void {
		//this function are move to EstimateMainDetailCalculationService
		// let mainDataService: U = dataService || this.estimateMainServ;
		// TODO this.estDetailCalServ.calculateDetails(item, colName, mainDataService, ignoreCalculateDetail);
	}

	/**
	 * calCostInLocalCurrency function calculates Cost in local currency
	 * @param item Item to be calcuated
	 */
	public calCostInLocalCurrency<T extends IEstResourceEntity | IEstLineItemEntity>(item: T): void {
		this.estMulCurrency.calculateMultiCurrencies(item);
	}

	/**
	 * Calculate cost unit, hours unit and related fields of Line Item
	 * @param lineItem Line item to be calculated
	 * @param resources Resources to be modified
	 */
	public calculateCostOfLineItem(lineItem: IEstLineItemEntity, resources: IEstResourceEntity[]): void {
		if (!lineItem) {
			return;
		}

		const isTotalWq = this.estimateMainContextService.getEstTypeIsTotalWq();
		this.completeCalculationServ.initializeLineItemUnit(lineItem);
		if (resources) {
			const resourceTreeOfFirstLevel = resources.filter((resource) => {
				return resource.EstResourceFk === null;
			});
			this.sumResourcesTotalToLineItem(lineItem, resourceTreeOfFirstLevel, this.getChildrenResources, false, false);
		}
		this.completeCalculationServ.calculateLineItemTotal(lineItem, isTotalWq);
		// TODO this.estStdAllowance.calculateStandardAllowance(lineItem, resources, getChildrenResources);

		if (lineItem.AdvancedAllowance !== 0) {
			lineItem.AdvancedAll = lineItem.AdvancedAllowance;
			// TODO this.estStdAllowance.reCalculateAdvAllowance(lineItem, 'AdvancedAll');
		}

		this.budgetCalculationService.calLineItemBudgetDiff(lineItem, resources);
		this.calCostInLocalCurrency(lineItem);
	}

	private getChildrenResources(parentResource: IEstResourceEntity, resources: IEstResourceEntity[]): IEstResourceEntity[] {
		if (parentResource && Array.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0) {
			return parentResource.EstResources;
		}

		const children = resources.filter((item) => item.EstResourceFk === parentResource?.Id);
		const uniqueChildren: IEstResourceEntity[] = [];
		const seenIds = new Set<number>();

		for (const child of children) {
			if (child.Id !== null && child.Id !== undefined) {
				if (!seenIds.has(child.Id)) {
					seenIds.add(child.Id);
					uniqueChildren.push(child);
				}
			}
		}
		return uniqueChildren;
	}

	/**
	 * Sum Resources total to line item
	 * @param lineItem Line item
	 * @param resources Single resource
	 * @param getChildrenFunc Dynamic function
	 * @param parentIsCost Check if parent is cost code
	 * @param useParentIsCost Use parent as cost code
	 */
	public sumResourcesTotalToLineItem(lineItem: IEstLineItemEntity, resources: IEstResourceEntity[], getChildrenFunc: (parentResource: IEstResourceEntity, resources: IEstResourceEntity[]) => IEstResourceEntity[], useParentIsCost: boolean, parentIsCost: boolean) {
		if (!lineItem || !resources || !getChildrenFunc) {
			return;
		}

		resources.forEach((item) => {
			const children = getChildrenFunc(item, resources);

			if (!children || !children.length) {
				if (item.AdvancedAllowanceCostUnitLineItem) {
					lineItem.AdvancedAllowanceCostUnit += item.AdvancedAllowanceCostUnitLineItem;
					lineItem.AdvancedAllowanceCostUnit = this.roundingServ.doRoundingValue('AdvancedAllowanceCostUnit', lineItem.AdvancedAllowanceCostUnit);
				}
				this.sumSingleResourceTotalToLineItem(lineItem, item, useParentIsCost, parentIsCost);
			} else {
				if (this.resourceTypeService.isCompositeAssembly(item)) {
					if (item.AdvancedAllowanceCostUnitLineItem) {
						lineItem.AdvancedAllowanceCostUnit += item.AdvancedAllowanceCostUnitLineItem;
						lineItem.AdvancedAllowanceCostUnit = this.roundingServ.doRoundingValue('AdvancedAllowanceCostUnit', lineItem.AdvancedAllowanceCostUnit);
					}

					const isCost = item.IsCost || (useParentIsCost && parentIsCost);
					if (item.EstAssemblyTypeFk !== null && item.EstAssemblyTypeFk !== undefined && this.assemblyTypeDataService.isPaAssembly(item.EstAssemblyTypeFk)) {
						this.sumResourcesTotalToLineItem(lineItem, children, getChildrenFunc, useParentIsCost, parentIsCost);
					} else {
						this.sumSingleResourceTotalToLineItem(lineItem, item, true, isCost);
					}
				} else {
					this.sumResourcesTotalToLineItem(lineItem, children, getChildrenFunc, useParentIsCost, parentIsCost);
				}
			}
		});
	}

	/**
	 * Sum Single Resources total to line item
	 * @param lineItem Line item
	 * @param resource Single resource
	 * @param parentIsCost Check if parent is cost code
	 * @param useParentIsCost Use parent as cost code
	 */
	public sumSingleResourceTotalToLineItem(lineItem: IEstLineItemEntity, resource: IEstResourceEntity, useParentIsCost: boolean, parentIsCost: boolean) {
		if (!lineItem || !resource || resource.IsInformation) {
			return;
		}

		if (lineItem.EscalationCostUnit !== null && lineItem.EscalationCostUnit !== undefined) {
			lineItem.EscalationCostUnit = (lineItem.EscalationCostUnit ?? 0) + (resource.EscResourceCostUnit ?? 0) * (resource.QuantityInternal ?? 0);
			lineItem.EscalationCostUnit = this.roundingServ.doRoundingValue('EscalationCostUnit', lineItem.EscalationCostUnit);
		}

		resource.CostUnitLineItemInternal = resource.CostUnitLineItemInternal || 1;

		let isCost = resource.IsCost;

		if (useParentIsCost) {
			isCost = parentIsCost;
		}

		if (isCost) {
			if (resource.IsIndirectCost) {
				// calculate indirect cost unit(consider resource isIndirect flag true, Ind)
				lineItem.IndCostUnit = (lineItem.IndCostUnit ?? 0) + (resource.CostUnitLineItem ?? 0);
				lineItem.IndCostUnit = this.roundingServ.doRoundingValue('IndCostUnit', lineItem.IndCostUnit);

				lineItem.IndHoursUnit = (lineItem.IndHoursUnit ?? 0) + (resource.HoursUnitLineItem ?? 0);
				lineItem.IndHoursUnit = this.roundingServ.doRoundingValue('IndHoursUnit', lineItem.IndHoursUnit);
			} else {
				if ((resource.EstRuleSourceFk ?? 0) > 0) {
					// calculate direct rule cost unit(consider resource created from rule and isIndirect flag false, Dru)
					lineItem.DruCostUnit = (lineItem.DruCostUnit ?? 0) + (resource.CostUnitLineItem ?? 0);
					lineItem.DruCostUnit = this.roundingServ.doRoundingValue('DruCostUnit', lineItem.DruCostUnit);
					lineItem.DruHoursUnit = (lineItem.DruHoursUnit ?? 0) + (resource.HoursUnitLineItem ?? 0);
					lineItem.DruHoursUnit = this.roundingServ.doRoundingValue('DruHoursUnit', lineItem.DruHoursUnit);
				} else {
					// calculate entered cost unit(consider resource not created from rule, Ent)
					lineItem.EntCostUnit = (lineItem.EntCostUnit ?? 0) + (resource.CostUnitLineItem ?? 0);
					lineItem.EntCostUnit = this.roundingServ.doRoundingValue('EntCostUnit', lineItem.EntCostUnit);
					lineItem.EntHoursUnit = (lineItem.EntHoursUnit ?? 0) + (resource.HoursUnitLineItem ?? 0);
					lineItem.EntHoursUnit = this.roundingServ.doRoundingValue('EntHoursUnit', lineItem.EntHoursUnit);
				}
			}

			lineItem.DayWorkRateUnit = (lineItem.DayWorkRateUnit ?? 0) + (resource.DayWorkRateUnit ?? 0 * 0); // TODO resource.CostUnitLineItemInternal not declared in IEstResourceEntity;
			lineItem.DayWorkRateTotal = (lineItem.DayWorkRateTotal ?? 0) + ((lineItem.IsGc ?? false) || (lineItem.IsIncluded ?? false) ? 0 : resource.DayWorkRateTotal ?? 0);
			lineItem.DayWorkRateTotal = this.roundingServ.doRoundingValue('DayWorkRateTotal', lineItem.DayWorkRateTotal);
		} else {
			lineItem.MarkupCostUnit = (lineItem.MarkupCostUnit ?? 0) + (resource.CostUnitLineItem ?? 0);
			lineItem.MarkupCostUnit = this.roundingServ.doRoundingValue('MarkupCostUnit', lineItem.MarkupCostUnit);
		}
	}

	/**
	 * Set resource type readonly if code/description is set
	 * @param col column name
	 * @param resItem Single Resource
	 */
	public setResourceTypeReadOnly(col: string, resItem: IEstResourceEntity) {
		const formEntityRuntimeData: EntityRuntimeData<IEstResourceEntity> = new EntityRuntimeData<IEstResourceEntity>();
		if (col === 'Code' || col === 'DescriptionInfo') {
			const subItemHasChildren = resItem.EstResources && resItem.EstResources.length > 0;
			const isResourceTypeReadOnly = subItemHasChildren ? false : resItem.Code;
			formEntityRuntimeData.readOnlyFields.push({ field: 'EstResourceTypeFkExtend', readOnly: !isResourceTypeReadOnly });
			formEntityRuntimeData.readOnlyFields.push({ field: 'EstResourceTypeShortKey', readOnly: !isResourceTypeReadOnly });
			formEntityRuntimeData.entityIsReadOnly = false;
		}
	}

	/**
	 * Update total cost and hours of line items
	 * @param lineItemList Line item list
	 */
	public updateTotalCostNHours(lineItemList: IEstLineItemEntity[]) {
		if (lineItemList && lineItemList.length > 0) {
			this.total.TotalCost = 0;
			this.total.TotalCostRisk = 0;
			this.total.TotalHours = 0;
			lineItemList.forEach((lineItem) => {
				if ((lineItem.EstCostRiskFk ?? 0) > 0) {
					this.total.TotalCostRisk = (this.total.TotalCostRisk ?? 0) + (lineItem.CostTotal ?? 0);
				} else {
					this.total.TotalCost = (this.total.TotalCost ?? 0) + (lineItem.CostTotal ?? 0);
				}
				this.total.TotalHours = (this.total.TotalHours ?? 0) + (lineItem.HoursTotal ?? 0);
			});
		}
	}

	/**
	 * Set Cost unit read only
	 * @param resItem Single Resource
	 * @param selectedItem Selected resource
	 */
	public setCostUnitReadOnly(resItem: IEstResourceEntity, selectedItem: IPrjCostCodesEntity | IPrjMaterialEntity | IEstResourceEntity | IEstLineItemEntity) {
		const isRate = (selectedItem as IPrjCostCodesEntity).IsRate || false;    
		if (resItem.EstResourceTypeFk === 2) { 
			// TODO IEstResourceEntity not declared IsLabour
			// if (!selectedItem.IsLabour) {
			//     isRate = true;
			// }
		}
		this.resProcessor.setCostUnitReadOnly(resItem, isRate);
	}

	/**
	 * resources specific calculation
	 * @param resource Single Resource
	 * @param lineItem Line item
	 * @param resources REsources list
	 */
	public calculateResource(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, resources: IEstResourceEntity[]) {
		const resChanged = this.completeCalculationServ.calculateResourceCore(resource, lineItem, resources);
		this.completeCalculationServ.calculateResourceCore(resource, lineItem, resources);
		this.calculateCostOfLineItem(lineItem, resources);
		//this.resDynamicUserDefinedServ?.calculate(lineItem, resource, resources);
		return resChanged;
	}
}
