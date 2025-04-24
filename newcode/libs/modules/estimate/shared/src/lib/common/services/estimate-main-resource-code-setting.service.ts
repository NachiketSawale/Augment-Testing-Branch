import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { inject, Injectable } from '@angular/core';
import { ICostCodeEntity } from '@libs/basics/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateMainResourceType } from '../enums/estimate-main-resource-type.enum';
import { IMaterialSearchEntity } from '@libs/basics/shared';
import { IDescriptionInfo } from '@libs/platform/common';
import { IPrjCostCodesEntity } from '@libs/project/interfaces';
import { EstimateCommonTypeRecogniteService } from './estimate-common-type-recognite.service';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainResourceCodeSettingService{

	private readonly typeRecogniteService = inject(EstimateCommonTypeRecogniteService);

	private modifiedPrjCostCodes : number[] = [];
	private costCodeSelected: ICostCodeEntity | null = null;
	private materialSelected: IMaterialSearchEntity | null = null;
	private assemblySelected: IEstLineItemEntity | null = null;

	public getSelectedCostCode(){
		return this.costCodeSelected;
	}

	public setSelectedCostCode(value: ICostCodeEntity | null){
		this.costCodeSelected = value;
	}

	public getMaterialSelected(){
		return this.materialSelected;
	}

	public setMaterialSelected(value: IMaterialSearchEntity | null){
		this.materialSelected = value;
	}

	public getAssemblySelected(): IEstLineItemEntity | null{
		return this.assemblySelected;
	}

	public setAssemblySelected(value: IEstLineItemEntity | null){
		this.assemblySelected = value;
	}

	/**
	 * extract properties from costCode to resource
	 * @param resItem
	 * @param selectedItem
	 */
	public extractPropInfoFromCostCode(resItem: IEstResourceEntity, selectedItem: ICostCodeEntity | IPrjCostCodesEntity){
		this.initializeResource(resItem, selectedItem);
		//TODO-Walt
		// if (selectedLookupItem.Id) {
		// 	this.modifiedPrjCostCodes.push(selectedLookupItem);
		// }
		resItem.CostUnit = selectedItem.Rate ?? 1;
		resItem.CostUnitOriginal = resItem.CostUnit;
		resItem.BasUomFk =  selectedItem.UomFk ? selectedItem.UomFk : resItem.BasUomFk;
		if(this.typeRecogniteService.isPrjCostCodeEntity(selectedItem)){
			resItem.MdcCostCodeFk = selectedItem.IsOnlyProjectCostCode ? null : (selectedItem.BasCostCode && selectedItem.BasCostCode.Id) ? selectedItem.BasCostCode.Id : (selectedItem.OriginalId || selectedItem.Id);
		}else{
			resItem.MdcCostCodeFk = selectedItem.IsOnlyProjectCostCode ? null : (selectedItem.OriginalId || selectedItem.Id);
		}
		resItem.ProjectCostCodeFk = selectedItem.IsOnlyProjectCostCode ? (selectedItem.OriginalId || selectedItem.Id) : null;
		resItem.EstCostTypeFk = selectedItem.EstCostTypeFk;
		resItem.BasCurrencyFk = selectedItem.CurrencyFk;
		resItem.QuantityFactorCc = selectedItem.RealFactorQuantity ?? 1;
		resItem.HourFactor = selectedItem.FactorHour ?? 1;
		resItem.CostFactorCc = selectedItem.RealFactorCosts ?? 1;
		if(this.typeRecogniteService.isPrjCostCodeEntity(selectedItem)){
			resItem.HoursUnit = selectedItem.IsLabour ? 1 : (selectedItem.BasCostCode && selectedItem.BasCostCode.IsLabour) ? 1 : 0;
		}else{
			resItem.HoursUnit = selectedItem.IsLabour ? 1 : 0;
		}
		resItem.HoursUnit = selectedItem.HourUnit ? selectedItem.HourUnit : resItem.HoursUnit;
		resItem.PrcStructureFk = selectedItem.PrcStructureFk;
		resItem.IsRate = selectedItem.IsRate ?? false;
		resItem.IsEditable = selectedItem.IsEditable;
		resItem.IsBudget = selectedItem.IsBudget;
		resItem.IsCost = selectedItem.IsCost;
		resItem.IsEstimateCostCode = selectedItem.IsEstimateCostCode;
		resItem.IsRuleMarkupCostCode = selectedItem.IsRuleMarkupCostCode;
		resItem.IsLabour = selectedItem.IsLabour;
		resItem.DayWorkRateUnit = selectedItem.DayWorkRate ?? 0;
		//TODO-Walt: estimateMainResourceProcessor
		//let resProcessor = $injector.get('estimateMainResourceProcessor');
		//resProcessor.setBudgetReadOnly(resItem, selectedItem.IsBudget);
		//setCostUnitReadOnly(resItem, selectedItem);
		resItem.Co2Source = selectedItem.Co2Source;
		resItem.Co2Project = selectedItem.Co2Project;
	}

	public extractPropInfoFromMaterial(resItem: IEstResourceEntity, selectedItem: IMaterialSearchEntity) {
		this.initializeResource(resItem, selectedItem);
		resItem.MdcMaterialFk = selectedItem.Id;
		resItem.MdcCostCodeFk = selectedItem.MdcCostCodeFk ? selectedItem.MdcCostCodeFk : resItem.MdcCostCodeFk;
		resItem.EstCostTypeFk = selectedItem.EstCostTypeFk;
		resItem.BasUomFk = selectedItem.BasUomFk ? selectedItem.BasUomFk : resItem.BasUomFk;
		resItem.BasCurrencyFk = selectedItem.BasCurrencyFk;
		resItem.HourFactor = selectedItem.FactorHour;
		resItem.HoursUnit = selectedItem.IsLabour ? 1 : 0;
		resItem.HoursUnit = selectedItem.HourUnit ? selectedItem.HourUnit : resItem.HoursUnit;
		resItem.PrcStructureFk = selectedItem.PrcStructureFk;
		resItem.DayWorkRateUnit = selectedItem.DayworkRate;
		const factorPriceUnit = selectedItem.FactorPriceUnit ? selectedItem.FactorPriceUnit : 1;
		const priceUnit = selectedItem.PriceUnit ? selectedItem.PriceUnit : 1;
		resItem.CostUnit = selectedItem.EstimatePrice * factorPriceUnit / priceUnit;// ALM 101673
		resItem.CostUnitOriginal = resItem.CostUnit;
		resItem.MaterialPriceListFk = selectedItem.MaterialPriceListFk;

		resItem.IsBudget = selectedItem.MdcCostCodeFk ? selectedItem.CostCodeIsBudget : resItem.IsBudget;
		resItem.IsCost = selectedItem.MdcCostCodeFk ? selectedItem.CostCodeIsCost : false;
		resItem.IsEstimateCostCode = selectedItem.MdcCostCodeFk ? selectedItem.CostCodeTypeIsEstimateCc : resItem.IsEstimateCostCode;
		resItem.IsRuleMarkupCostCode = selectedItem.MdcCostCodeFk ? (selectedItem.CostCodeTypeIsAllowance || selectedItem.CostCodeTypeIsRp || selectedItem.CostCodeTypeIsAm || selectedItem.CostCodeTypeIsGa) : resItem.IsRuleMarkupCostCode;

		resItem.Co2Source = selectedItem.Co2Source;
		resItem.Co2Project = selectedItem.Co2Project;

		if (resItem.MdcCostCodeFk) {
			//TODO-Walt
			// let mdcCC = basicsLookupdataLookupDescriptorService.getData('estcostcodeslist');
			// let mdcCostCode = _.find(mdcCC, {Id: resItem.MdcCostCodeFk});
			// if (mdcCostCode) {
			// 	modifiedPrjCostCodes.push(mdcCostCode);
			// }
		}

		if (selectedItem.IsLabour) {
			if (selectedItem.IsRate) {
				resItem.IsRate = true;
			}
		} else {
			resItem.IsRate = true;
		}

		//TODO-Walt
		//setCostUnitReadOnly(resItem, selectedItem);
		//resetLastPriceListToResource(resItem, selectedItem);
	}
	
	public extractPropInfoFromAssembly(resItem: IEstResourceEntity, selectedItem: IEstLineItemEntity, isAssembly: boolean){
		this.initializeResource(resItem, selectedItem);
		resItem.EstAssemblyFk = selectedItem.Id;
		if (resItem.Version === 0) {
			resItem.EstHeaderAssemblyFk = selectedItem.EstHeaderFk;
			resItem.BasUomFk = selectedItem.BasUomFk;
			resItem.CostFactor1 = selectedItem.CostFactor1;
			resItem.CostFactor2 = selectedItem.CostFactor2;
			resItem.CostFactorDetail1 = selectedItem.CostFactorDetail1;
			resItem.CostFactorDetail2 = selectedItem.CostFactorDetail2;
			resItem.CostTotal = selectedItem.CostTotal;
			resItem.CostUnit = isAssembly && selectedItem.MarkupCostUnit ? selectedItem.CostUnit + selectedItem.MarkupCostUnit : selectedItem.CostUnit;
			resItem.CostUnitOriginal = resItem.CostUnit;
			resItem.IsDisabled = selectedItem.IsDisabled;
			if('IsDisabledPrc' in selectedItem){
				resItem.IsDisabledPrc = selectedItem.IsDisabledPrc as boolean;
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
			resItem.CostTotal = selectedItem.CostTotal;
			resItem.CostUnit = selectedItem.CostUnit;
			resItem.CostUnitOriginal = resItem.CostUnit;
		}
		if('CurrencyFk' in selectedItem && selectedItem.CurrencyFk){
			resItem.BasCurrencyFk = selectedItem.CurrencyFk as number;
		}
		resItem.HoursTotal = selectedItem.HoursTotal;
		resItem.HoursUnit = selectedItem.HoursUnit;
		resItem.DayWorkRateUnit = selectedItem.DayWorkRateUnit ? selectedItem.DayWorkRateUnit : (selectedItem.QuantityTotal ? (selectedItem.DayWorkRateTotal/selectedItem.QuantityTotal) : 0);
		resItem.Co2SourceTotal = selectedItem.Co2SourceTotal;
		resItem.Co2ProjectTotal = selectedItem.Co2ProjectTotal;
		resItem.Co2Source = selectedItem.QuantityTotal ? ((selectedItem.Co2SourceTotal ?? 0)/selectedItem.QuantityTotal) : selectedItem.Co2SourceTotal;
		resItem.Co2Project = selectedItem.QuantityTotal ? ((selectedItem.Co2ProjectTotal ?? 0)/selectedItem.QuantityTotal) : selectedItem.Co2SourceTotal;
	}

	public extractPropInfoFromResResource(resItem: IEstResourceEntity, selectedItem: IEstResourceEntity){
		this.initializeResource(resItem, selectedItem);
		resItem.MdcCostCodeFk = selectedItem.Id;
		resItem.EstCostTypeFk = selectedItem.EstCostTypeFk;
		//TODO-Walt: not sure the selectItem type
		// resItem.QuantityFactorCc = selectedItem.RealFactorQuantity;
		// resItem.CostFactorCc = selectedItem.RealFactorCosts;
		// resItem.HoursUnit = selectedItem.IsLabour ? 1 : 0;
		resItem.PrcStructureFk = selectedItem.PrcStructureFk;
		resItem.IsBudget = selectedItem.IsBudget;
		resItem.IsCost = selectedItem.IsCost;
		resItem.IsEstimateCostCode = selectedItem.IsEstimateCostCode;
		resItem.IsRuleMarkupCostCode = selectedItem.IsRuleMarkupCostCode;
		//TODO-Walt
		//setCostUnitReadOnly(resItem, selectedItem);
	}

	public initializeResource(resItem: IEstResourceEntity, selectedItem: ICostCodeEntity | IMaterialSearchEntity | IEstLineItemEntity | IEstResourceEntity){
		resItem.MdcCostCodeFk = null;
		resItem.MdcMaterialFk = null;
		resItem.EstAssemblyFk = null;
		if('IsInformation' in selectedItem){
			resItem.IsInformation = selectedItem.IsInformation;
		}
		if (resItem.EstResourceTypeFk !== EstimateMainResourceType.ResResource) {
			resItem.Code = selectedItem.Code;
			resItem.DescriptionInfo = selectedItem.DescriptionInfo;
			if('Description2Info' in selectedItem){
				resItem.DescriptionInfo1 = selectedItem.Description2Info as IDescriptionInfo | null;
			}
			if('DescriptionInfo2' in selectedItem){
				resItem.DescriptionInfo1 = selectedItem.DescriptionInfo2;
			}
		}
	}

	public resetPropInfo(resItem: IEstResourceEntity){
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

	public setPropInfo(resItem: IEstResourceEntity, selectedItem: ICostCodeEntity | IMaterialSearchEntity | IEstLineItemEntity | IEstResourceEntity){
		if('DescriptionInfo' in selectedItem && selectedItem.DescriptionInfo){
			if(resItem.DescriptionInfo){
				Object.assign(resItem.DescriptionInfo, selectedItem.DescriptionInfo);
			}else{
				resItem.DescriptionInfo = {...selectedItem.DescriptionInfo};
			}
		}
	}
}