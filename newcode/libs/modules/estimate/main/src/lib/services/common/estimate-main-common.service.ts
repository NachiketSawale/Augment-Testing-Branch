/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, Injector,inject } from '@angular/core';
import { ITranslated, PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import {
	IEstContrUnitResponceData,
	IEstDynamicColReadData,
	IEstDynamicColumn,
	IEstPrjUpdateData,
	IEstResourceToSave,
	IEstResponceLineItems,
	IEstTotalCost,
	IEstlsumUom,
	IOverwrite,
	IEstCharacteristicDataEntity,
} from '../../model/interfaces/estimate-main-common.interface';
import { IPrjCostCodesEntity } from '@libs/project/interfaces';
import { IPrjMaterialEntity } from '@libs/project/interfaces';
import { EMPTY, Observable, of } from 'rxjs';
import { EstimateMainAssignAssemblyService } from './estimate-main-assign-assembly.service';
import { EstimateMainCommonFunctionsService } from './estimate-main-common-functions.service';
import { EstimateMainCharacteristicCommonFunService } from './estimate-main-characteristic-common-fun.service';
import { EstimateMainCommonCalculationFunctionService } from './estimate-main-common-calculation-functions.service';
import { EstimateMainCommonCostcodeAndResourceFunService } from './estimate-main-common-costcode-and-resource-fun.service';
import { IBoqItemEntity } from '@libs/boq/interfaces';

import {
	AssemblyCalculationService,
	BudgetCalculationService,
	EstimateCommonTypeRecogniteService,
	EstimateMainCompleteCalculationService,
	EstimateMainContextService,
	EstimateMainExchangeRateService,
	EstimateMainResourceType,
	EstimateMainRoundingService,
} from '@libs/estimate/shared';
import { AssemblyType, IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateCommonItemInfoService} from '@libs/estimate/common';
import { EstimateMainResourceProcessService } from '../../containers/resource/estimate-main-resource-process.service';
import { EstimateAssembliesService } from '@libs/estimate/assemblies';
import { EstimateMainResourceService } from '../../containers/resource/estimate-main-resource-data.service';
import { IEntityModification, IEntitySelection } from '@libs/platform/data-access';
@Injectable({
	providedIn: 'root'
})

/**
 * @name EstimateMainCommonService
 * @description It is the data service for estimate related common functionality. *
 */
export class EstimateMainCommonService {
	// TODO
	// const totalUpdated = new Platform.Messenger();
	// onLinkBoqItemSucceeded = new Platform.Messenger();
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly injector = inject(Injector);
	private roundingServ = inject(EstimateMainRoundingService);
	private translateService = inject(PlatformTranslateService);
	private commonFun = inject(EstimateMainCommonFunctionsService);
	private charCommonFun = inject(EstimateMainCharacteristicCommonFunService);
	private commonCalFun = inject(EstimateMainCommonCalculationFunctionService);
	private commonResFun = inject(EstimateMainCommonCostcodeAndResourceFunService);
	private completeCalculationServ = inject(EstimateMainCompleteCalculationService);
	private readonly budgetCalculationService = inject(BudgetCalculationService);
	private typeRecogniteService = inject(EstimateCommonTypeRecogniteService);
	private itemInfoService = inject(EstimateCommonItemInfoService);
	//estimateMainServ = inject(EstimateMainService);
	private basicLookupDescriptiorServ = null; // inject(basicsLookupdataLookupDescriptorService);
	private estAssembliesServ = inject(EstimateAssembliesService);
	private estAssembliesCalServ = inject(AssemblyCalculationService);
	private total: IEstTotalCost = { TotalCost: 0, TotalCostRisk: 0, TotalHours: 0, MajorCostCode: [], MajorCostTotal: 0, IsValid: false };
	private estAssemblyTypeLogics!: AssemblyType;
	private selectedLookupItem!: IPrjCostCodesEntity;
	private modifiedPrjCostCodes!: IPrjCostCodesEntity[];
	private _companyContextFk = -1;
	private isActivate = false;
	//private boqHeader2Id2SplitQtyList!: IEstBoqItem[];
	private lsumUom!: IEstlsumUom;
	private readonly resourceProcessorService!: EstimateMainResourceProcessService;
	private estResourceTypes!: EstimateMainResourceType;

	/**
	 * Modify resource changing isChange property
	 * @param source Sourceline item
	 * @param target Target line item
	 */
	public isLineItemChange(source: IEstLineItemEntity[], target: IEstLineItemEntity[]) {
		this.commonFun.isLineItemChange(source, target);
	}

	/**
	 * CalculateDetails function provides calculation for details column
	 * @param item Item to be calculated
	 * @param colName Column name
	 * @param dataService Dataservice of the item
	 * @param ignoreCalculateDetail To ignore calculation
	 */
	public calculateDetails<T, U>(item: T, colName: string, dataService: U, ignoreCalculateDetail: boolean): void {
		this.commonCalFun.calculateDetails(item, colName, dataService, ignoreCalculateDetail);
	}

	/**
	 * calCostInLocalCurrency function calculates Cost in local currency
	 * @param item Item to be calcuated
	 */
	public calCostInLocalCurrency<T extends IEstResourceEntity | IEstLineItemEntity>(item: T): void {
		this.commonCalFun.calCostInLocalCurrency(item);
	}

	/**
	 * Calculate cost unit, hours unit and related fields of Line Item
	 * @param lineItem Line item to be calculated
	 * @param resources Resources to be modified
	 */
	public calculateCostOfLineItem(lineItem: IEstLineItemEntity, resources: IEstResourceEntity[]): void {
		this.commonCalFun.calculateCostOfLineItem(lineItem, resources);
	}

	/**
	 * Sum Resources total to line item
	 * @param lineItem Line item
	 * @param resource Single resource
	 * @param getChildrenFunc Dynamic function
	 * @param parentIsCost Check if parent is cost code
	 * @param useParentIsCost Use parent as cost code
	 */
	public sumResourcesTotalToLineItem(lineItem: IEstLineItemEntity, resources: IEstResourceEntity[], getChildrenFunc: (parentResource: IEstResourceEntity, resources: IEstResourceEntity[]) => IEstResourceEntity[], useParentIsCost: boolean, parentIsCost: boolean) {
		this.commonCalFun.sumResourcesTotalToLineItem(lineItem, resources, getChildrenFunc as (parentResource: IEstResourceEntity, resources: IEstResourceEntity[]) => IEstResourceEntity[], useParentIsCost, parentIsCost);
	}

	/**
	 * Sum Single Resources total to line item
	 * @param lineItem Line item
	 * @param resource Single resource
	 * @param parentIsCost Check if parent is cost code
	 * @param useParentIsCost Use parent as cost code
	 */
	public sumSingleResourceTotalToLineItem(lineItem: IEstLineItemEntity, resource: IEstResourceEntity, useParentIsCost: boolean, parentIsCost: boolean) {
		this.commonCalFun.sumSingleResourceTotalToLineItem(lineItem, resource, useParentIsCost, parentIsCost);
	}

	/**
	 * Calculate Quantity of line item core
	 * @param lineItem Line item
	 */
	public calculateQuantityOfLineItemCore(lineItem: IEstLineItemEntity) {
		if (!lineItem){
			return;
		}

		//TODO: circle reference with EstimateMainCommonService
		// this.estMainCommonServ.setQuantityByLsumUom(lineItem, true);
		const quantityTarget = this.estimateMainContextService.getEstTypeIsTotalWq() ? lineItem.WqQuantityTarget : lineItem.QuantityTarget;

		if (lineItem.IsDisabled) {
			lineItem.QuantityUnitTarget = 0;
			lineItem.QuantityTotal = quantityTarget * lineItem.QuantityUnitTarget;
			lineItem.QuantityTotal = this.roundingServ.doRoundingValue('QuantityTotal', lineItem.QuantityTotal);
		} else {
			lineItem.Quantity = Object.prototype.toString.call(lineItem.Quantity) === '[object Number]' ? lineItem.Quantity : 1;
			this.roundingServ.roundInitialQuantities(lineItem);
			lineItem.QuantityUnitTarget = lineItem.Quantity * lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor;
			lineItem.QuantityUnitTarget = this.roundingServ.doRoundingValue('QuantityUnitTarget', lineItem.QuantityUnitTarget);
			const qtyTarget = lineItem.IsLumpsum ? 1 : quantityTarget;
			lineItem.QuantityTotal = lineItem.IsOptional && !lineItem.IsOptionalIT ? 0 : qtyTarget * lineItem.QuantityUnitTarget;
			lineItem.QuantityTotal = this.roundingServ.doRoundingValue('QuantityTotal', lineItem.QuantityTotal);
		}
	}

	/**
	 * calculate Quantity Unit Target for line item
	 * @param lineItem Line item
	 */
	public calQuantityUnitTarget(lineItem: IEstLineItemEntity) {
		if (!lineItem) {
			return;
		}

		this.calculateQuantityOfLineItemCore(lineItem);
		this.budgetCalculationService.calItemBudget(lineItem);
		this.budgetCalculationService.calItemUnitBudget(lineItem);
	}

	/**
	 *  Set resource type readonly if code/description is set
	 * @param col column name
	 *  @param resItem Single Resource
	 */
	public setResourceTypeReadOnly(col: string, resItem: IEstResourceEntity) {
		this.commonCalFun.setResourceTypeReadOnly(col, resItem);
	}

	/**
	 * Update total cost and hours of line items
	 * @param lineItemList Line item list
	 */
	public updateTotalCostNHours(lineItemList: IEstLineItemEntity[]) {
		this.commonCalFun.updateTotalCostNHours(lineItemList);
	}

	/**
	 * Get Major cost code
	 *  @param resItem Single Resource
	 */
	public getMajorCC(resItem: IEstResourceEntity) {
		// type CostCode = {
		// 	code: string;
		// 	costTotal?: number;
		// 	descInfo?: IDescriptionInfo | {};
		// };

		// let item: ICostCodeEntity = { Id: 0, ContrCostCodeFk: 0 },
		// 	cc: CostCode = { code: '', descInfo: {} };
		// let estCostCodesList: ICostCodeEntity[] = []; //this.basicLookupDescriptiorServ?.getData('estcostcodeslist');

		// if (resItem.MdcCostCodeFk) {
		// 	item = estCostCodesList.find((i) => i.Id === resItem.MdcCostCodeFk)!;
		// }

		// if (item) {
		// 	if (item.CostCodeParentFk !== undefined) {
		// 		if (item.CostCodeParentFk !== null) {
		// 			// TODO let parentItem = inject(CloudCommonGridService).getRootParentItem(item, estCostCodesList, 'CostCodeParentFk');
		// 			let parentItem: ICostCodeEntity;
		// 			if (parentItem) {
		// 				cc.code = parentItem.Code;
		// 				cc.descInfo = parentItem.DescriptionInfo;
		// 			}
		// 		} else {
		// 			cc.code = item.Code;
		// 			cc.descInfo = item.DescriptionInfo;
		// 		}
		// 	}
		// }
		// return cc;
	}

	/**
	 * handle total calculation
	 */
	public handlerTotalCalculation(response: IEstResponceLineItems) {
		// let majorCC: IPrjCostCodesEntity[],
		// 	cc: IPrjCostCodesEntity = { Code: '', Id: 0 };

		if (response.Data && response.Data.length > 0) {
			response.Data.forEach((item) => {
				// item.EstResources does not exists
				// if (item.EstResources && item.EstResources.length > 0) {
				// 	item.EstResources.forEach((res) => {
				// 		if (res.EstResourceTypeFk !== 5) {
				// 			let costCode = this.getMajorCC(res);
				// 			if (costCode.code !== '') {
				// 				cc.Code = costCode.code;
				// 				cc.Description = costCode.descInfo.Description;
				// 				//cc.CostTotal = res.costTotal; costTotal does not exist
				// 				majorCC.push(cc);
				// 			}
				// 		}
				// 	});
				// }
			});
			this.updateTotalCostNHours(response.Data);
		}

		// if (majorCC.length > 0) {
		// 	const grouped = majorCC.reduce(
		// 		(acc, item) => {
		// 			const key = item.Code;
		// 			if (!acc[key]) {
		// 				acc[key] = [];
		// 			}
		// 			acc[key].push(item);
		// 			return acc;
		// 		},
		// 		{} as Record<string, IPrjCostCodesEntity[]>,
		// 	);

		// 	const result = Object.entries(grouped).map(([key, value]) => ({
		// 		code: key,
		// 		costCodeDetail: value,
		// 	}));

		// 	if (result && result.length > 0) {
		// 		this.total.MajorCostTotal = 0;

		// 		result.forEach((ccDetail) => {
		// 			if (ccDetail.costCodeDetail) {
		// 				let costTotal = 0;
		// 				// TODO
		// 				// ccDetail.costCodeDetail.forEach(costCodeDetail=> {
		// 				//     costTotal += costCodeDetail.costTotal;
		// 				// });

		// 				// ccDetail.costTotal = costTotal;
		// 				// ccDetail.desc = ccDetail.costCodeDetail[0].desc;
		// 				this.total.MajorCostTotal += costTotal;
		// 			}
		// 		});
		// 	}
		// 	// this.total.majorCostCode = result;
		// }
		this.total.IsValid = true;
		//TODO totalUpdated.fire();
	}

	/**
	 * Set Cost unit read only
	 * @param resItem Single Resource
	 * @param selectedItem Selected resource
	 */
	public setCostUnitReadOnly(resItem: IEstResourceEntity, selectedItem: IPrjCostCodesEntity | IPrjMaterialEntity | IEstLineItemEntity | IEstResourceEntity) {
		this.commonCalFun.setCostUnitReadOnly(resItem, selectedItem);
	}

	/**
	 * resources specific calculation
	 * @param resource Single Resource
	 * @param lineItem Line item
	 * @param resources REsources list
	 */
	public calculateResource(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, resources: IEstResourceEntity[]) {
		return this.commonCalFun.calculateResource(resource, lineItem, resources);
	}

	/**
	 * Calculate line item and resources - As per disable flag calculate total cost, hours and quantity
	 * @param lineItem Line item
	 * @param resources REsources
	 * @param calculateExtendColumns
	 */
	public calculateLineItemAndResources(lineItem: IEstLineItemEntity, resources: IEstResourceEntity[], calculateExtendColumns?: boolean) {
		if (!lineItem){
			 return;
		}

		if (Array.isArray(resources) && resources.length > 0) {
			if (lineItem.EstLineItemFk === null && lineItem.Id !== resources[0].EstLineItemFk) {
				return;
			}
		}

		this.calculateQuantityOfLineItemCore(lineItem);
		this.completeCalculationServ.updateResourcesNew(lineItem, resources);
		this.calculateCostOfLineItem(lineItem, resources);

		if ( calculateExtendColumns === undefined || calculateExtendColumns) {
			this.calculateExtendColumnValuesOfLineItem(lineItem, resources);
		}
		//this.estDynamicUserDefinedServ?.calculate(lineItem, resources);
	}

	/**
	 * Calculate Reference Line Item
	 * @param selectedLineItem Selected line item
	 * @param flattenResources Resources in flat list
	 */
	public calculateReferenceLineItem(selectedLineItem: IEstLineItemEntity, flattenResources: IEstResourceEntity[]) {
		const lineItemList: IEstLineItemEntity[] = []; //TODO:EstimateMainService this.estimateMainServ.getList();
		const referenceLineItems: IEstLineItemEntity[] = this.getReferenceLineItems(selectedLineItem, lineItemList);
		if (!referenceLineItems || referenceLineItems.length === 0) {
			return;
		}

		referenceLineItems.forEach((item) => {
			const resourcesClone = this.cloneAndFilterResources(flattenResources);
			//this.basicLookupDescriptiorServ?.updateData('refLineItemResources', resourcesClone);
			this.calculateLineItemAndResources(item, resourcesClone);
			//this.estMainColumnconfig.attachExtendColumnsToLineItem(item, resourcesClone, this.estimateMainConfigDetailService?.getColumnConfigDetails());
			//this.basicLookupDescriptiorServ?.updateData('refLineItemResources', '');
		});
	}

	private cloneAndFilterResources(flattenResources: IEstResourceEntity[]) {
		return flattenResources.filter((item) => {
			return item.EstResourceFk === null;
		});
	}

	private getReferenceLineItems(lineItem: IEstLineItemEntity, estLineItemList: IEstLineItemEntity[]) {
		let allRefLineItemList: IEstLineItemEntity[] = [];
		const refLineItems = estLineItemList.filter((item) => item.EstLineItemFk === lineItem.Id);

		if ( refLineItems !== undefined && refLineItems !== null && refLineItems.length > 0) {
			allRefLineItemList = allRefLineItemList.concat(refLineItems);

			refLineItems.forEach((item) => {
				const curRefLineItems = this.getReferenceLineItems(item, estLineItemList);

				if ( curRefLineItems !== undefined && curRefLineItems !== null && curRefLineItems.length > 0) {
					allRefLineItemList = allRefLineItemList.concat(curRefLineItems);
				}
			});
		}
		return allRefLineItemList;
	}

	/**
	 * Calculate Extend Column Values Of LineItem
	 * @param selectedLineItem Selected line item
	 * @param resourceList List of resources
	 * @param lookupItem Lookup type
	 */
	public calculateExtendColumnValuesOfLineItem(selectedLineItem: IEstLineItemEntity, resourceList: IEstResourceEntity[], lookupItem?: object) {
		//this.estMainColumnconfig?.attachExtendColumnsToLineItem(selectedLineItem, resourceList, this.estimateMainConfigDetailService?.getColumnConfigDetails(), lookupItem);
		this.calculateReferenceLineItem(selectedLineItem, resourceList);
	}

	/**
	 * Create Detail And Cost Total Calculation
	 * @param dataService Dynamic data service
	 * @param calculateFunc Dynamic calculation function
	 * @param isAssembly Check if it is assembly
	 */

	public createDetailAndCostTotalCalculationFunc<T>(dataService: T, calculateFunc: typeof this.estAssembliesCalServ.calculateResourceOfAssembly , isAssembly: boolean,assemblyType:string = '') : (arg: unknown, resItemList: IEstResourceEntity[], parentLineItem: IEstLineItemEntity, lookupItem: IPrjCostCodesEntity) => IEstResourceEntity[] {
		return (arg: unknown, resItemList: IEstResourceEntity[], parentLineItem: IEstLineItemEntity, lookupItem: IPrjCostCodesEntity) => {
			let retValue: IEstResourceEntity[] = [];
			// TODO replace arg with PlatformGridApi
			// const col = arg.cell ? arg.grid.getColumns()[arg.cell].field : arg.colName;
			// const resItem: IEstResourceEntity = arg && arg.Id > 0 ? arg : arg.item;
			const col = '';
			const resItem: IEstResourceEntity | null  = inject(EstimateMainResourceService).getSelectedEntity(); // workaround until arg is fixed
			const extractItemProp = true;
			if (!resItem){
				return retValue;
			}

			this.calculateDetails(resItem, col, dataService, true);
			retValue.push(resItem);

			switch (resItem.EstResourceTypeFk) {
				case 1:
				case 2:
				case 3:
				case 4: {
					if (!(resItem.EstResourceTypeFk === 4 && (resItem.EstAssemblyTypeFk ?? 0) > 0)) {
						this.setSelectedCodeItem(col, resItem, extractItemProp, lookupItem, isAssembly);
					}
					retValue = calculateFunc(resItem, parentLineItem, resItemList,assemblyType);
					break;
				}
				case 5: {
					retValue = calculateFunc(resItem, parentLineItem, resItemList,assemblyType);
					break;
				}
				case 6: {
					//EstResKindFk does not exist on IEstResourceEntity
					// if ((resItem.EstResKindFk ?? 0) > 0) {
					// 	this.setSelectedCodeItem(col, resItem, extractItemProp, lookupItem);
					// }
					break;
				}
			}
			this.setResourceTypeReadOnly(col, resItem);
			return retValue;
		};
	}

	/**
	 * Sync calculation for Resource container
	 * @param arg Argumanets from platform
	 * @param resItemList Resources list
	 * @param parentLineItem Parent line item
	 * @param lookupItem Lookup item selected
	 */
	public estimateResources(arg: unknown, resItemList: IEstResourceEntity[], parentLineItem: IEstLineItemEntity, lookupItem: IPrjCostCodesEntity) {
		return this.createDetailAndCostTotalCalculationFunc(this.estimateMainContextService, this.calculateResource, false)(arg, resItemList, parentLineItem, lookupItem);
	}

	/**
	 * Calculate detail and cost total of assmbly
	 * @param arg Argumanets from platform
	 * @param resItemList Resources list
	 * @param parentLineItem Parent line item
	 * @param lookupItem Lookup item selected
	 */
	public calculateDetailAndCostTotalOfAssembly(arg: unknown, resItemList: IEstResourceEntity[], parentLineItem: IEstLineItemEntity, lookupItem: IPrjCostCodesEntity, assemblyType: string) {
		const calculationFunc = this.createDetailAndCostTotalCalculationFunc<EstimateAssembliesService>(this.estAssembliesServ, this.estAssembliesCalServ.calculateResourceOfAssembly, true,  assemblyType);
		return calculationFunc(arg, resItemList, parentLineItem, lookupItem);
	}

	/**
	 * This function is used to handle properties according to resource type
	 * @param selectedItem Selected resource type
	 * @param resItem Current resource
	 * @param isAssembly Check whether it is assembly
	 */
	public extractSelectedItemProp(selectedItem: IPrjCostCodesEntity | IPrjMaterialEntity | IEstLineItemEntity | IEstResourceEntity, resItem: IEstResourceEntity, isAssembly?: boolean) {
		if (resItem && selectedItem && selectedItem.Id) {
			resItem.MdcCostCodeFk = null;
			resItem.MdcMaterialFk = null;
			resItem.EstAssemblyFk = null;
			resItem.IsInformation = 'IsInformation' in selectedItem ? selectedItem.IsInformation : null;

			if (resItem.EstResourceTypeFk !== 6) {
				resItem.Code = (selectedItem.Code ?? '');
				resItem.DescriptionInfo = 'DescriptionInfo' in selectedItem ? selectedItem.DescriptionInfo : null;
				// TODO Description2Info not found
				// resItem.DescriptionInfo1 = selectedItem.Description2Info || selectedItem.DescriptionInfo2;
				// if (!resItem.DescriptionInfo1) {
				// 	resItem.DescriptionInfo1 = {};
				// }
			}
			// Costcodes
			if (resItem.EstResourceTypeFk === 1 && this.typeRecogniteService.isPrjCostCodeEntity(selectedItem)) {
				if (this.selectedLookupItem.Id) {
					this.modifiedPrjCostCodes.push(this.selectedLookupItem);
				}

				resItem.CostUnit = selectedItem.Rate ?? 0;
				resItem.CostUnitOriginal = resItem.CostUnit;
				resItem.BasUomFk = selectedItem.UomFk ? selectedItem.UomFk : resItem.BasUomFk;
				resItem.MdcCostCodeFk = selectedItem.IsOnlyProjectCostCode ? null : selectedItem.BasCostCode && selectedItem.BasCostCode.Id ? selectedItem.BasCostCode.Id : selectedItem.OriginalId || selectedItem.Id;
				resItem.ProjectCostCodeFk = selectedItem.IsOnlyProjectCostCode ? selectedItem.OriginalId || selectedItem.Id : null;
				resItem.EstCostTypeFk = selectedItem.EstCostTypeFk;
				resItem.BasCurrencyFk = selectedItem.CurrencyFk;
				resItem.QuantityFactorCc = selectedItem.RealFactorQuantity ?? 1;
				resItem.HourFactor = selectedItem.FactorHour ?? 1;
				resItem.CostFactorCc = selectedItem.RealFactorCosts ?? 1;
				resItem.HoursUnit = selectedItem.IsLabour ? 1 : selectedItem.BasCostCode && selectedItem.BasCostCode.IsLabour ? 1 : 0;
				resItem.HoursUnit = selectedItem.HourUnit ? selectedItem.HourUnit : resItem.HoursUnit;
				resItem.PrcStructureFk = selectedItem.PrcStructureFk;
				resItem.IsRate = !!selectedItem.IsRate;
				resItem.IsEditable = selectedItem.IsEditable;
				resItem.IsBudget = selectedItem.IsBudget;
				resItem.IsCost = selectedItem.IsCost;
				resItem.IsEstimateCostCode = selectedItem.IsEstimateCostCode;
				resItem.IsRuleMarkupCostCode = selectedItem.IsRuleMarkupCostCode;
				resItem.DayWorkRateUnit = selectedItem.DayWorkRate ?? 0;
				this.resourceProcessorService.setBudgetReadOnly(resItem, selectedItem.IsBudget);
				this.setCostUnitReadOnly(resItem, selectedItem);
				if (resItem.DescriptionInfo) {
					resItem.DescriptionInfo.DescriptionTr = 0;
				}
				resItem.Co2Source = selectedItem.Co2Source;
				resItem.Co2Project = selectedItem.Co2Project ?? 0;
				// Material
			}else if (resItem.EstResourceTypeFk === 2 && this.typeRecogniteService.isMaterialEntity(selectedItem)) {
				resItem.MdcMaterialFk = selectedItem.BasMaterial && selectedItem.BasMaterial.Id ? selectedItem.BasMaterial.Id : selectedItem.Id;
				resItem.MdcCostCodeFk = selectedItem.MdcCostCodeFK ? selectedItem.MdcCostCodeFK : selectedItem.BasMaterial && selectedItem.MdcCostCodeFK ? selectedItem.MdcCostCodeFK : resItem.MdcCostCodeFk;
				resItem.EstCostTypeFk = selectedItem.EstCostTypeFk;
				if(this.typeRecogniteService.isResourceEntity(selectedItem)){
					resItem.BasUomFk = (selectedItem as IEstResourceEntity).BasUomFk ? (selectedItem as IEstResourceEntity).BasUomFk : selectedItem.UomFk ? selectedItem.UomFk : resItem.BasUomFk;
				}
				resItem.BasCurrencyFk = selectedItem.BasCurrencyFk;
				resItem.HourFactor = selectedItem.FactorHour ?? 1;
				resItem.HoursUnit = (selectedItem as IPrjCostCodesEntity).IsLabour ? 1 : 0;
				resItem.HoursUnit = (selectedItem as IPrjCostCodesEntity).HourUnit ? (selectedItem as IPrjCostCodesEntity).HourUnit! : resItem.HoursUnit;
				resItem.PrcStructureFk = selectedItem.PrcStructureFk;
				resItem.DayWorkRateUnit = selectedItem.DayWorkRate ?? 0;
				const factorPriceUnit = selectedItem.FactorPriceUnit ? selectedItem.FactorPriceUnit : 1;
				const priceUnit = selectedItem.PriceUnit ? selectedItem.PriceUnit : 1;
				resItem.CostUnit = ((selectedItem.EstimatePrice ?? 0) * factorPriceUnit) / priceUnit; // ALM 101673
				resItem.CostUnitOriginal = resItem.CostUnit;
				//resItem.MaterialPriceListFk = selectedItem.MaterialPriceListFk;

				//resItem.IsBudget = selectedItem.MdcCostCodeFk ? selectedItem.CostCodeIsBudget : resItem.IsBudget;
				//resItem.IsCost = selectedItem.MdcCostCodeFk ? selectedItem.CostCodeIsCost : resItem.IsCost;
				//resItem.IsEstimateCostCode = selectedItem.MdcCostCodeFk ? selectedItem.CostCodeTypeIsEstimateCc : resItem.IsEstimateCostCode;
				//resItem.IsRuleMarkupCostCode = selectedItem.MdcCostCodeFk ? selectedItem.CostCodeTypeIsAllowance || selectedItem.CostCodeTypeIsRp || selectedItem.CostCodeTypeIsAm || selectedItem.CostCodeTypeIsGa : resItem.IsRuleMarkupCostCode;

				resItem.Co2Source = selectedItem.Co2Source;
				resItem.Co2Project = selectedItem.Co2Project ?? 0;

				if (resItem.MdcCostCodeFk ) {
					// TODO
					// let mdcCC = inject(BasicsLookupdataLookupDescriptorService).getData('estcostcodeslist');
					// let mdcCostCode = mdcCC.find((item) => item.Id === resItem.MdcCostCodeFk);
					// if (mdcCostCode) {
					// 	modifiedPrjCostCodes.push(mdcCostCode);
					// }
				}

				if(this.typeRecogniteService.isPrjCostCodeEntity(selectedItem)){
					if (selectedItem.IsLabour) {
						if (selectedItem.IsRate) {
							resItem.IsRate = true;
						}
					} else {
						resItem.IsRate = true;
					}
				}

				if(this.typeRecogniteService.isMaterialEntity(selectedItem)){
					if(resItem.DescriptionInfo){
						resItem.DescriptionInfo.DescriptionTr = 0;
					}

					this.setCostUnitReadOnly(resItem, selectedItem);
					this.resetLastPriceListToResource(resItem, selectedItem);
				}

			} else if ((resItem.EstResourceTypeFk === 4 || resItem.EstResourceTypeFk === 3) && this.typeRecogniteService.isAssemblyEntity(selectedItem)) {
				resItem.EstAssemblyFk = selectedItem.Id;

				if (resItem.Version === 0) {
					resItem.EstHeaderAssemblyFk = selectedItem.EstHeaderFk;
					resItem.BasUomFk = selectedItem.BasUomFk;
					resItem.BasCurrencyFk = (selectedItem as IPrjCostCodesEntity).CurrencyFk;
					resItem.CostFactor1 = selectedItem.CostFactor1;
					resItem.CostFactor2 = selectedItem.CostFactor2;
					resItem.CostFactorDetail1 = selectedItem.CostFactorDetail1;
					resItem.CostFactorDetail2 = selectedItem.CostFactorDetail2;
					resItem.CostTotal = selectedItem.CostTotal;
					resItem.CostUnit = isAssembly && selectedItem.MarkupCostUnit ? selectedItem?.CostUnit + selectedItem.MarkupCostUnit : selectedItem?.CostUnit;
					resItem.CostUnitOriginal = resItem.CostUnit;
					resItem.IsDisabled = !!selectedItem.IsDisabled;
					if(this.typeRecogniteService.isResourceEntity(selectedItem)){
						resItem.IsDisabledPrc = (selectedItem as IEstResourceEntity).IsDisabledPrc;
					}
					resItem.IsLumpsum = selectedItem.IsLumpsum;
					resItem.Quantity = selectedItem.Quantity;
					resItem.QuantityDetail = selectedItem.QuantityDetail;
					resItem.QuantityFactor1 = selectedItem.QuantityFactor1;
					resItem.QuantityFactor2 = selectedItem.QuantityFactor2;
					resItem.QuantityFactor3 = selectedItem.QuantityFactor3;
					resItem.QuantityFactor4 = selectedItem.QuantityFactor4;
					resItem.QuantityFactorDetail1 = selectedItem.QuantityFactorDetail1;
					resItem.QuantityFactorDetail2 = selectedItem.QuantityFactorDetail2;
					resItem.ProductivityFactor = selectedItem.ProductivityFactor;
					resItem.ProductivityFactorDetail = selectedItem.ProductivityFactorDetail;
				} else {
					resItem.EstHeaderAssemblyFk = selectedItem.EstHeaderFk;
					resItem.BasUomFk = selectedItem.BasUomFk;
					resItem.BasCurrencyFk = (selectedItem as IPrjCostCodesEntity).CurrencyFk;
					resItem.CostTotal = selectedItem.CostTotal;
					resItem.CostUnit = selectedItem.CostUnit;
					resItem.CostUnitOriginal = resItem.CostUnit;
				}
				resItem.HoursTotal = selectedItem.HoursTotal;
				resItem.HoursUnit = selectedItem.HoursUnit ?? 0;
				resItem.DayWorkRateUnit = (selectedItem.DayWorkRateUnit ?? (selectedItem.QuantityTotal ? (selectedItem?.DayWorkRateTotal ?? 0) / selectedItem.QuantityTotal : 0));
				resItem.Co2SourceTotal = selectedItem.Co2SourceTotal;
				resItem.Co2ProjectTotal = selectedItem.Co2ProjectTotal;
				resItem.Co2Source = selectedItem.QuantityTotal ? (selectedItem.Co2SourceTotal ?? 0) / selectedItem.QuantityTotal : selectedItem?.Co2SourceTotal ?? 0;
				resItem.Co2Project = selectedItem.QuantityTotal ? (selectedItem?.Co2ProjectTotal ?? 0) / selectedItem.QuantityTotal : selectedItem?.Co2SourceTotal ?? 0;
			} else if (resItem.EstResourceTypeFk === 6 && this.typeRecogniteService.isResourceEntity((selectedItem as IEstResourceEntity))) {
				resItem.MdcCostCodeFk = selectedItem.Id;
				resItem.EstCostTypeFk = (selectedItem as IEstResourceEntity).EstCostTypeFk;
				resItem.QuantityFactorCc = (selectedItem as IPrjCostCodesEntity).RealFactorQuantity ?? 1;
				resItem.CostFactorCc = (selectedItem as IPrjCostCodesEntity).RealFactorCosts ?? 1;
				resItem.HoursUnit = (selectedItem as IPrjCostCodesEntity).IsLabour ? 1 : 0;
				resItem.PrcStructureFk = selectedItem.PrcStructureFk;
				resItem.IsBudget = (selectedItem as IPrjCostCodesEntity).IsBudget;
				resItem.IsCost = (selectedItem as IPrjCostCodesEntity).IsCost;
				resItem.IsEstimateCostCode = (selectedItem as IPrjCostCodesEntity).IsEstimateCostCode;
				resItem.IsRuleMarkupCostCode = (selectedItem as IPrjCostCodesEntity).IsRuleMarkupCostCode;

				this.setCostUnitReadOnly(resItem, selectedItem as IEstLineItemEntity);
			}
		} else if (resItem && selectedItem === null) {
			resItem.Code = '';
			// resItem.DescriptionInfo = {};
			// resItem.DescriptionInfo1 = {};
			resItem.MdcCostCodeFk = null;
			resItem.MdcMaterialFk = null;
			resItem.EstAssemblyFk = null;
			resItem.EstCostTypeFk = null;
			resItem.BasCurrencyFk = null;
			resItem.BasUomFk = 0;
			resItem.CostFactorCc = 1;
			resItem.CostFactor1 = 1;
			resItem.CostFactor2 = 1;
			resItem.CostFactorDetail1 = null;
			resItem.CostFactorDetail2 = null;
			resItem.CostTotal = 0;
			resItem.CostUnit = 0;
			resItem.HoursTotal = 0;
			resItem.HoursUnit = 0;
			resItem.IsDisabled = false;
			resItem.IsDisabledPrc = false;
			resItem.IsLumpsum = false;
			resItem.ProductivityFactor = 1;
			resItem.Quantity = 1;
			resItem.QuantityDetail = null;
			resItem.QuantityFactor1 = 1;
			resItem.QuantityFactor2 = 1;
			resItem.QuantityFactor3 = 1;
			resItem.QuantityFactor4 = 1;
			resItem.EfficiencyFactor1 = 1;
			resItem.EfficiencyFactor2 = 1;
			resItem.QuantityFactorCc = 1;
			resItem.QuantityInternal = 1;
			resItem.QuantityReal = 1;
			resItem.QuantityTotal = 1;
			resItem.QuantityUnitTarget = 1;
			resItem.QuantityFactorDetail1 = null;
			resItem.QuantityFactorDetail2 = null;
			resItem.EstResourceFlagFk = null;
			resItem.DayWorkRateUnit = 0;
			resItem.DayWorkRateTotal = 0;
			resItem.IsInformation = false;
			resItem.Co2SourceTotal = 0;
			resItem.Co2ProjectTotal = 0;
			resItem.Co2Source = 0;
			resItem.Co2Project = 0;
		}
	}

	/**
	 * Reset Price list
	 * @param resItem Select resource
	 * @param selectedItem Selected line item
	 */
	public resetLastPriceListToResource(resItem: IEstResourceEntity, selectedItem: IPrjMaterialEntity) {
		this.commonFun.resetLastPriceListToResource(resItem, selectedItem);
	}

	/**
	 * select code item for costcode, material etc
	 * @param col Column name
	 * @param resItem Resource item
	 * @param extractItemProp Boolean to check condition
	 * @param lookupItem Lookup item
	 * @param selectedLookupItem Select lookup type
	 * @param isAssembly Check if it is assembly
	 */
	public setSelectedCodeItem(col: string, resItem: IEstResourceEntity, extractItemProp: boolean, lookupItem: IPrjCostCodesEntity, isAssembly?: boolean) {
		this.setSelectedCodeItemInternal(col, resItem, extractItemProp, lookupItem, this.selectedLookupItem, isAssembly);
	}

	/**
	 * select code item for costcode, material etc
	 * @param col Column name
	 * @param resItem Resource item
	 * @param extractItemProp Boolean to check condition
	 * @param lookupItem Lookup item
	 * @param selectedLookupItem Select lookup type
	 * @param isAssembly Check if it is assembly
	 */
	private setSelectedCodeItemInternal(col: string, resItem: IEstResourceEntity, extractItemProp: boolean, lookupItem: IPrjCostCodesEntity, selectedLookupItem: IPrjCostCodesEntity, isAssembly?: boolean) {
		const selectedItem = selectedLookupItem;
		const isLookupSelected = selectedItem && selectedItem.Id;
		if ((col === 'Code' || col === 'DescriptionInfo') && isLookupSelected) {
			if (extractItemProp) {
				this.extractSelectedItemProp(selectedItem, resItem, isAssembly);
			}
		} else {
			if (lookupItem !== null &&  lookupItem !== undefined &&  lookupItem.Id !== undefined) {
				this.extractSelectedItemProp(lookupItem, resItem, isAssembly);
			}
		}

		resItem.ExchangeRate = inject(EstimateMainExchangeRateService).getExchRate(resItem.BasCurrencyFk || 0);
	}

	/**
	 * Modify indirect value
	 * @param res Resource item
	 */
	public ModifyIsIndirectValue(res: IEstResourceEntity) {
		this.commonResFun.ModifyIsIndirectValue(res);
	}

	/**
	 * Assign assembly to lineitem and set properties
	 * @param lineItem Get lineitem object
	 * @param assembly Get Assembly object
	 * @param projectId Get project id
	 * @param isAssemblyToWic Check if is coming from WIC
	 * @param overwrite some flags(overwrite resource and rules)
	 * @param pastedContent when drag from assembly wic
	 * @param isNewLineItem Check if it is new
	 */
	public assignAssembly(lineItem: IEstLineItemEntity, assembly: IEstLineItemEntity, projectId: number, isAssemblyToWic: boolean, overwrite: IOverwrite, pastedContent: IEstLineItemEntity[], isNewLineItem: boolean) {
		inject(EstimateMainAssignAssemblyService).assignAssembly(lineItem, assembly, projectId, isAssemblyToWic, overwrite, pastedContent, isNewLineItem);
	}

	/**
	 * Get Leaf Boq
	 * @param boqItem Dynamic boq item
	 */
	public getLeafBoqItem(boqItem: IBoqItemEntity[]) {
		this.commonResFun.getLeafBoqItem(boqItem);
	}

	/**
	 * Get assembly resource
	 * @param assembly Assembly item
	 * @param projectId Project id
	 * @param estHeaderFk Estimate header id
	 * @param estLineItemIds line item ids
	 */
	public getAssemblyResources(assembly: IEstLineItemEntity, projectId: number, estHeaderFk: number, estLineItemIds: number[]) {
		this.commonResFun.getAssemblyResources(assembly, projectId, estHeaderFk, estLineItemIds);
	}

	/**
	 * Check if resource can be deleted
	 * @param lineItemId line item id
	 * @param lineItemUomFk line item Uom Id
	 * @param assemblyUomFk Assembly Uom id
	 * @param estHeaderFk Header id
	 */
	public checkIfResourceCanBeDeleted(lineItemId: number, lineItemUomFk: number, assemblyUomFk: number, estHeaderFk: number) {
		this.commonResFun.checkIfResourceCanBeDeleted(lineItemId, lineItemUomFk, assemblyUomFk, estHeaderFk);
	}

	/**
	 * Find ControllingUnit based on assembly id and project id
	 * @param assemblyId Id of assembly
	 * @param projectId Id of project
	 */
	public findControllingUnit(assemblyId: number, projectId: number): Observable<IEstContrUnitResponceData> {
		return this.http.get<IEstContrUnitResponceData>(this.configurationService.webApiBaseUrl + 'estimate/assemblies/findcontrollingunit?assemblyId=' + assemblyId + '&projectId=' + projectId, {});
	}

	/**
	 * Link Boq Item by assembly
	 * @param assemblyId Id of assembly
	 * @param assemblyHeaderId Id of Assembly header
	 * @param lineItemHeaderFk Id of header
	 * @param projectId Id of project
	 */
	public linkBoqItemByAssembly(assemblyId: number, assemblyHeaderId: number, lineItemHeaderFk: number, projectId: number): Observable<object> {
		return this.commonResFun.linkBoqItemByAssembly(assemblyId, assemblyHeaderId, lineItemHeaderFk, projectId) ?? EMPTY;
	}

	/**
	 * Reset Total
	 */
	public resetTotal() {
		this.total = { TotalCost: 0, TotalCostRisk: 0, TotalHours: 0, MajorCostCode: [], MajorCostTotal: 0, IsValid: false };
		// totalUpdated.fire(); //TODO
	}

	/**
	 * Get Total
	 */
	public getTotal() {
		return this.total;
	}

	/**
	 * Set Total
	 * @param sum Set sum into total
	 */
	public setTotal(sum: number) {
		this.total.TotalCost = sum;
		this.total.IsValid = true;
		// totalUpdated.fire(); TODO
	}

	/**
	 * Register total updation
	 * @param callBackFn Function tobe executed
	 */
	// public registerTotalUpdated(callBackFn: Function) {
	// 	// TODO totalUpdated.register(callBackFn);
	// }

	/**
	 * Unregister total updation
	 * @param callBackFn Function tobe executed
	 */
	// public unregisterTotalUpdated(callBackFn: Function) {
	// 	// TODO totalUpdated.unregister(callBackFn);
	// }

	/**
	 * Get project cost codes
	 */
	public getPrjCostCodes() {
		return this.modifiedPrjCostCodes;
	}

	/**
	 * Add project cost codes
	 * @param costCode Dynamic project costcode items
	 * @param modifiedPrjCostCodes modified project costcodes
	 */
	public addPrjCostCodes(costCode: IPrjCostCodesEntity) {
		this.commonResFun.addPrjCostCodes(costCode, this.modifiedPrjCostCodes);
	}

	/**
	 * Set project cost codes
	 * @param projectId Id of project
	 */
	public setPrjCostCodes(projectId: number) {
		this.modifiedPrjCostCodes = [];
		this.commonResFun.setPrjCostCodes(projectId);
	}

	/**
	 * calculate total of all major costcodes of resources
	 * @param estHeaderFk Header id
	 */
	public getTotalMajorCCByEstHeader(estHeaderFk: number) {
		this.http.get<IEstResponceLineItems>(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/getresourcesbyestheaderfk?estHeaderFk=' + estHeaderFk).subscribe((response: IEstResponceLineItems) => {
			this.handlerTotalCalculation(response);
		});
	}

	/**
	 * calculate total of all major costcodes of resources
	 */
	public getTotalMajorCCBySelectedLineItem(lineItemId: number) {
		this.http.get<IEstResponceLineItems>(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/getresourcesbylineitem?lineItemId=' + lineItemId).subscribe((response: IEstResponceLineItems) => {
			this.handlerTotalCalculation(response);
		});
	}

	/**
	 * calculate total of all major costcodes of resources
	 */
	public getTotalMajorCCByFilter() {
		const totalCaluationParam = {
			estHeaderId: this.estimateMainContextService ? this.estimateMainContextService.getSelectedEstHeaderId() : -1,
			prjProjectFk: this.estimateMainContextService ? this.estimateMainContextService.getSelectedProjectId() : -1,

			// TODO
			// boqItemFk: this.getFilterItemId(EstimateMainBoqService),
			// psdActivityFk: this.getFilterItemId(EstimateMainActivityService),
			// prjLocationFk: this.getFilterItemId(EstimateMainLocationService)
		};

		this.http.post<IEstResponceLineItems>(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/getresourcesbyfilter', totalCaluationParam).subscribe((response: IEstResponceLineItems) => {
			this.handlerTotalCalculation(response);
		});
	}

	/**
	 * Set selected Lookup item
	 */
	public setSelectedLookupItem(lookupItem: IPrjCostCodesEntity) {
		this.selectedLookupItem = lookupItem;
	}
	/**
	 * Get selected Lookup item
	 * @returns
	 */
	public getSelectedLookupItem() {
		return this.selectedLookupItem;
	}

	/**
	 * Reset Lookup item
	 */
	public resetLookupItem() {
		this.selectedLookupItem = { Id: 0, Code: '' };
	}

	/**
	 * Get assembly Type
	 */
	public getAssemblyType(assemblyId: number) {
		return this.http.get(this.configurationService.webApiBaseUrl + 'estimate/assemblies/assemblytype/assemblytypebyassemblyid?assemblyId=' + assemblyId);
	}

	/**
	 * Check circular dependency
	 */
	public CheckAssemblyCircularDependency(/* assemblyId */) {
		return of({ data: false });
	}

	/**
	 * get assembly by id
	 */
	public getAssemblyById(id: number) {
		return this.http.get(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/getassemblybyid?id=' + id);
	}

	/**
	 * get assemblies by id
	 */
	public getAssembliesById(ids: number[]) {
		return this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/getassembliesbyid', ids);
	}

	/**
	 * Get assembly type by id
	 */
	public getAssemblyTypeById(id: number) {
		//return this.basicLookupDescriptiorServ.getLookupItem('estassemblytypes', id);
	}

	/**
	 * get resource type by assembly type
	 * @param assemblyType Type of assembly to process
	 */
	public getResourceTypeByAssemblyType(assemblyType: string) {
		return this.commonResFun.getResourceTypeByAssemblyType(assemblyType);
	}

	/**
	 * Move selected item
	 * @param type Moveup/MoveDown
	 * @param gridId Grid id of container
	 */
	public moveSelectedItemTo(type: number, gridId: string) {
		this.commonFun.moveSelectedItemTo(type, gridId);
	}

	/**
	 * Get Grid selected info
	 *  @param gridId Grid id of container
	 */
	public getGridSelectedInfos(gridId: string) {
		return this.commonFun.getGridSelectedInfos(gridId);
	}

	/**
	 * Generate Characteristic columns
	 * @param dataService Dynamic Dataservice
	 * @param sectionId Section id for dataservice
	 */
	// public generateCharacteristicColumns(dataService: typeof BasicsCharacteristicCharacteristicDataService, sectionId: string) {
	// 	this.charCommonFun.generateCharacteristicColumns(dataService, sectionId);
	// }

	/**
	 * Append characteristic columns from dynamic data service
	 * @param data Dynamic data
	 * @param dataService dymanic dataservice
	 * @param items Dynamic data passed
	 * @param isCreateAssignDefault boolean vlaue to show characteristics
	 */
	public appendCharactiricColumnData<PT,PU extends object>(data:IEstCharacteristicDataEntity[], dataService: IEntitySelection<PT> & IEntityModification<PT>, items: IEntitySelection<PU>[], isCreateAssignDefault?: boolean) {
		this.charCommonFun.appendCharactiricColumnData(data, dataService, items, isCreateAssignDefault);
	}

	/**
	 * Set dynamic columns
	 * @param readData Dynamic data to process
	 * @param dynamicColumns Dynamic columns to set
	 * @param isCombined Boolean to set combine
	 */
	public setDynamicColumnsData(readData: IEstDynamicColReadData, dynamicColumns: IEstDynamicColumn, isCombined: boolean) {
		this.charCommonFun.setDynamicColumnsData(readData, dynamicColumns, isCombined);
	}

	/**
	 * Get characteristics columns
	 * @param data Dynamic data to process characteristics
	 */
	public getCharactCols(data: IEstCharacteristicDataEntity[]) {
		return this.charCommonFun.getCharactCols(data);
	}

	/**
	 * Append characteristic columns
	 * @param idorField Column field
	 * @param item Dynamic data
	 */
	public appendCharacCol(idorField: string, item: IEstCharacteristicDataEntity) {
		return this.charCommonFun.appendCharacCol(idorField, item);
	}

	/**
	 * Create characteristics column
	 * @param item Dynamic data
	 * @param columnIdorField Column id
	 * @param columnName Column name
	 */
	public createCharactCol(item: IEstCharacteristicDataEntity, columnIdorField: string, columnName: string) {
		return this.charCommonFun.createCharactCol(item, columnIdorField, columnName);
	}

	/**
	 * Get Formatter for columns
	 * @param item Dynamic data
	 */
	public getFormatter(item: IEstCharacteristicDataEntity) {
		return this.charCommonFun.getFormatter(item);
	}

	/**
	 * true: remove column, false: do not remove
	 * @param selectItem Dynamic item
	 * @param idorField Id of column
	 * @param dataService Dynamic data service
	 */
	public isRemoveColumn<PT>(selectItem: IEstLineItemEntity, idorField: string, dataService: IEntitySelection<PT> & IEntityModification<PT>) {
		return this.charCommonFun.isRemoveColumn(selectItem, idorField, dataService);
	}

	/**
	 * Synchronize characteristic columns
	 * @param lineItem Lineitem to process
	 * @param characteristicCol Characteristic column to process
	 * @param type Type of characteristic
	 * @param dataService Dynamic data service
	 */
	public syncCharacteristicCol<PT>(lineItem: IEstLineItemEntity, characteristicCol: string, type: string, dataService: IEntitySelection<PT> & IEntityModification<PT>) {
		this.charCommonFun.syncCharacteristicCol(lineItem, characteristicCol, type, dataService);
	}

	/**
	 * Check if it is characteristic column
	 * @param col Check column
	 * @returns True false
	 */
	public isCharacteristicCulumn(col: IEstCharacteristicDataEntity) {
		return this.charCommonFun.isCharacteristicCulumn(col);
	}

	/**
	 * Check characteristic column expired
	 * @param col Check column
	 */
	public isCharacteristicColumnExpired(col: IEstCharacteristicDataEntity) {
		return col && col.IsCharacteristicExpired;
	}

	/**
	 * Get characteristic value
	 * @param lineItem Dynamic line item
	 * @param colArray Dynamic column array
	 */
	public getCharacteristicColValue(lineItem: IEstLineItemEntity, colArray: string[]) {
		return this.charCommonFun.getCharacteristicColValue(lineItem, colArray);
	}

	/**
	 * Set company context
	 * @param contextFk Company context id
	 */
	public setCompanyContextFk(contextFk: number) {
		this._companyContextFk = contextFk;
	}

	/**
	 * Get company context
	 */
	public getCompanyContextFk() {
		return this._companyContextFk;
	}

	/**
	 * Delete Procuerement Package
	 * @param item line item
	 * @param level type of item
	 */
	public deletePrcPackageAssignments(item: IEstLineItemEntity | IEstResourceToSave, level: string) {
		return this.commonResFun.deletePrcPackageAssignments(item, level);
	}

	/**
	 * Delete Rules
	 * @param updateData Items to be deleted
	 */
	// public collectRule2Deleted(updateData: unknown /**replace with EstCompleteEntity not ready */) {
	// 	this.commonFun.collectRule2Deleted(updateData);
	// }

	/**
	 * Get resource by line item ids
	 * @param lineItemIds Id of lineitems
	 * @param headerIds Id of Est header
	 */
	public getResourcesByLineItemIds(lineItemIds: number[], headerIds: number[]) {
		return this.commonResFun.getResourcesByLineItemIds(lineItemIds, headerIds);
	}

	/**
	 * Check activate estimate indicator in system option
	 */
	public getActivateEstIndicator() {
		return this.isActivate;
	}

	/**
	 * Set activate header
	 * @param isActivate Check if it is activate
	 */
	public setActivateEstIndicator() {
		this.commonFun.setActivateEstIndicator(this.isActivate);
	}

	/**
	 * Get Assembly type logic
	 */
	public getEstAssemblyTypeLogics() {
		return this.estAssemblyTypeLogics;
	}

	/**
	 * Get est Resource types
	 */
	public getEstResourceTypes() {
		return this.estResourceTypes;
	}

	/**
	 * check if it is LumpsumUom
	 * @param uomId Id of Uom
	 */
	public isLumpsumUom(uomId: number) {
		return this.commonFun.isLumpsumUom(uomId);
	}

	/**
	 * Set quantity by LsumUom
	 * @param lineItem Current line item
	 * @param doCheckLsum Check if it is lumsum
	 * @param isLsumUom Check if it is lumsum uom
	 */
	public setQuantityByLsumUom(lineItem: IEstLineItemEntity, doCheckLsum: boolean, isLsumUom?: boolean) {
		if (!lineItem) {
			return;
		}
		if (doCheckLsum) {
			isLsumUom = lineItem.BasUomFk !== null && this.getLsumUomId() === lineItem.BasUomFk;
		}
		if (isLsumUom) {
			lineItem.WqQuantityTarget = 1;
			lineItem.WqQuantityTargetDetail = lineItem.WqQuantityTarget.toString();
			lineItem.QuantityTarget = 1;
			lineItem.QuantityTargetDetail = lineItem.QuantityTarget.toString();
		}
	}

	/**
	 * Set LsumUom Id
	 */
	public setLsumUom() {
		this.commonFun.setLsumUom();
	}

	/**
	 * Get LsumUom Id
	 */
	public getLsumUomId(): number | null {
		return this.lsumUom ? this.lsumUom.Id : null;
	}

	/**
	 * Merge Cells
	 * @param item Resource Item
	 * @param gridId Grid id of container
	 */
	public setMergeCell(item: IEstResourceEntity, gridId: string) {
		this.commonResFun.setMergeCell(item, gridId);
	}

	/**
	 * Clear error
	 * @param updateData Date to be modify
	 */
	public clearDeserializationError(updateData: IEstPrjUpdateData) {
		this.commonFun.clearDeserializationError(updateData);
	}

	/**
	 * Translate comment column
	 */
	public translateCommentCol(item: IEstLineItemEntity | IEstResourceEntity) {
		if (item && item.CommentText) {
			item.originCommentText = item.originCommentText || item.CommentText;
		}
		item.CommentText = this.translateCommentColtext(item.CommentText || '');
	}

	/**
	 * Translate comment text
	 * @param commentText Coommnet text to be modified
	 */
	public translateCommentColtext(commentText: string): string {
		return this.commonFun.translateCommentColtext(commentText);
	}

	/**
	 * Get comment item info
	 * @param item Line items or Resource items
	 * @param itemInfos Translated item info
	 */
	public getCommonItemInfo(item: IEstLineItemEntity | IEstResourceEntity, itemInfos: ITranslated[]) {
		this.itemInfoService.getCommonItemInfo(item, itemInfos);
	}

	/**
	 * Set item info for line item
	 * @param item line items
	 */
	public buildLineItemInfo(item: IEstLineItemEntity): string {
		return this.itemInfoService.buildLineItemInfo(item);
	}

	/**
	 * Set item info for resource
	 * @param item Resource items
	 */
	public buildResourceItemInfo(item: IEstResourceEntity): string {
		return this.itemInfoService.buildResourceItemInfo(item);
	}

	/**
	 * Check detail format
	 * @param dtos Data from server
	 * @param dataService Dynamic dataservice
	 */
	public checkDetailFormat(dtos: IEstResourceEntity[], dataService: unknown) {
		this.commonFun.checkDetailFormat(dtos, dataService);
	}

	/**
	 * Save config details columns
	 * @param combinedLineItems Line items
	 * @param confDetailColumns Detail columns
	 */
	// public collectConfDetailColumnsToSave(combinedLineItems: IEstLineItemEntity[], confDetailColumns: IConfDetailItem[]): string[] {
	// 	return this.commonFun.collectConfDetailColumnsToSave(combinedLineItems, confDetailColumns);
	// }

	/**
	 * Set BoqHeader2Id2SplitQtyList, this property are move to estimateMainContextService
	 */
	// public setBoqHeader2Id2SplitQtyList(list: any) {
	// 	this.boqHeader2Id2SplitQtyList = list && list.length ? list : [];
	// }

	/**
	 * Enable/disable Calculate Split Quantity at LineItem
	 * @param boqItemId Id of Boq
	 * @param boqHeaderId Id od boq header
	 */
	public doCalculateSplitQuantity(boqItemId: number, boqHeaderId: number) {
		const boqItem = this.estimateMainContextService.Boq2CalcQtySplitMap.find((item) => item.Item1 === boqHeaderId && item.Item2 === boqItemId);
		return boqItem && boqItem.Item3;
	}

	/**
	 * Merge Cells
	 * @param item Resource Item
	 * @param gridId Grid id of container
	 */
	public setCLMergeCell(item: IEstResourceEntity, gridId: string) {
		this.commonResFun.setCLMergeCell(item, gridId);
	}
}
