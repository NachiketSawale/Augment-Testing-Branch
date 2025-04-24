/*
 * Copyright(c) RIB Software GmbH
 */

import { EstimateMainService } from './estimate-main-line-item-data.service';
import { IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import {
	BudgetCalculationService,
	EstimateLineItemBaseProcessService,
	EstimateLineItemBaseValidationService,
	EstimateMainCompleteCalculationService,
	EstimateMainContextService,
	EstimateMainDetailCalculationService, IEstStructureDetailBaseEntity
} from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import * as _ from 'lodash';
import { inject, Injectable } from '@angular/core';
import { IDescriptionInfo, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { EstimateMainResourceService } from '../resource/estimate-main-resource-data.service';
import { EstimateMainCommonService } from '../../services/common/estimate-main-common.service';
import { EstimateMainRefLineItemService } from '../../services/common/estimate-main-ref-line-item.service';
import { EstimateMainParamStructureConstant } from '../../model/enums/estimate-main-param-structure.enum';
import { IEstLineItem2MdlObjectEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { BasicsShareControllingUnitLookupService } from '@libs/basics/shared';
import { lastValueFrom } from 'rxjs';
import { ProjectLocationLookupService } from '@libs/project/shared';

interface LineItemLeadingStructureItem {
	Id: number,
	Code: string,
	Quantity?: number,
	QuantityAdj?: number,
	BasUomFk?: number | null,
	UomFk?: number | null,
	UoMFk?: number | null,
	QuantityUoMFk?: number | null,
	IsBoqSplitQuantity?: boolean,
	DescriptionInfo?: IDescriptionInfo
}

@Injectable({
	providedIn: 'root'
})
export class EstimateMainLineItemValidationService extends EstimateLineItemBaseValidationService {

	private readonly processService: EstimateLineItemBaseProcessService<IEstLineItemEntity>;
	private readonly estimateMainCompleteCalculationService = inject(EstimateMainCompleteCalculationService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly estimateMainDetailCalculationService = inject(EstimateMainDetailCalculationService);
	private readonly estimateMainResourceService = inject(EstimateMainResourceService);
	private readonly estimateMainCommonService = inject(EstimateMainCommonService);
	private readonly budgetCalculationService = inject(BudgetCalculationService);
	private readonly controllingUnitLookupService = inject(BasicsShareControllingUnitLookupService);
	private readonly projectLocationLookupService = inject(ProjectLocationLookupService);
	private readonly estimateMainRefLineItemService: EstimateMainRefLineItemService;

	public constructor(protected estimateMainService: EstimateMainService) {
		super(estimateMainService);
		this.processService = new EstimateLineItemBaseProcessService(estimateMainService);
		this.estimateMainRefLineItemService = new EstimateMainRefLineItemService(this.estimateMainResourceService);
	}

	public override generateCustomizeValidationFunctions(): IValidationFunctions<IEstLineItemEntity> | null {
		return {
			//TODO:EstAssemblyFk: asyncValidateEstAssemblyFk
			//TODO:AssemblyType
			Quantity: [this.detailRelPropValidation('QuantityDetail')],
			QuantityDetail: [this.detailPropValidate('Quantity')],
			QuantityFactor1: [this.detailRelPropValidation('QuantityFactorDetail1')],
			QuantityFactorDetail1: [this.detailPropValidate('QuantityFactor1')],
			QuantityFactor2: [this.detailRelPropValidation('QuantityFactorDetail2')],
			QuantityFactorDetail2: [this.detailPropValidate('QuantityFactor2')],
			QuantityFactor3: [this.valueChangeValidation],
			QuantityFactor4: [this.valueChangeValidation],
			QuantityTarget: [this.detailRelPropValidation('QuantityTargetDetail')],
			QuantityTargetDetail: [this.detailPropValidate('QuantityTarget')],
			WqQuantityTarget: [this.detailRelPropValidation('WqQuantityTargetDetail')],
			WqQuantityTargetDetail: [this.detailPropValidate('WqQuantityTarget')],
			ProductivityFactor: [this.detailRelPropValidation('ProductivityFactorDetail')],
			ProductivityFactorDetail: [this.detailPropValidate('ProductivityFactor')],
			CostFactor1: [this.detailRelPropValidation('CostFactorDetail1')],
			CostFactorDetail1: [this.detailPropValidate('CostFactor1')],
			CostFactor2: [this.detailRelPropValidation('CostFactorDetail2')],
			CostFactorDetail2: [this.detailPropValidate('CostFactor2')],
			IsOptional: this.validateIsOptional,
			IsNoMarkup: this.validateIsNoMarkup,
			IsFixedPrice: this.validateIsFixedPrice,
			IsGc: this.validateIsGc,
			GrandCostUnitTarget: this.validateGrandCostUnitTarget,
			ManualMarkupUnit: this.validateManualMarkupUnit,
			EstLineItemFk: this.validateEstLineItemFk,
			IsDisabled: this.validateIsDisabled,
			IsFixedBudget: this.validateIsFixedBudget,
			IsFixedBudgetUnit: this.validateIsFixedBudgetUnit,
			BudgetUnit: this.validateBudgetUnit,
			Budget: this.validateBudget,
			BoqSplitQuantityFk: this.asyncValidateBoqSplitQuantityFk,
			PsdActivityFk: this.asyncValidatePsdActivityFk,
			PrjLocationFk: this.asyncValidatePrjLocationFk,
			MdcControllingUnitFk: this.asyncValidateMdcControllingUnitFk,
			BoqItemFk: [this.validateBoqItemFk, this.asyncValidateBoqItemFk],
			WicBoqItemFk: this.validateWicBoqItemFk
		};
	}

	/**
	 * getLoadedEntitiesForUniqueComparison
	 * @param info
	 */
	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IEstLineItemEntity>) =>{
		return this.estimateMainService.getList().filter(e => e.Code === info.value);
	};

	public asyncValidateBoqSplitQuantityFk(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		const item = {} as LineItemLeadingStructureItem;// $injector.get('basicsBoqSplitQuantityLookupDataService').getItemByIdAsync(value, {dataServiceName: 'basicsBoqSplitQuantityLookupDataService'});
		item.IsBoqSplitQuantity = true;
		const result = { apply: true, valid: true, error: '' };
		if (info.value === 0) {
			_.set(info.entity, info.field, null);
		}
		if (item && item.Id) {
			item.IsBoqSplitQuantity = true;
			this.updateQuantityUomOnBoQ(info.entity, item, EstimateMainParamStructureConstant.BoQs);
			this.setQuantityTarget(info.entity);
			return this.calculateLineItemAndResources(info.entity, true).then(() => {
				return result;
			});
		} else {
			return Promise.resolve(result);
		}
	}

	public asyncValidatePsdActivityFk(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		const item = {} as LineItemLeadingStructureItem;// $injector.get('estimateMainActivityLookupService').getItemByIdAsync(value);
		return this.reactOnLeadingStructure(info, item, EstimateMainParamStructureConstant.ActivitySchedule, 'ActRel');
	}

	/**
	 * validate PrjLocationFk
	 * @param info
	 */
	public async asyncValidatePrjLocationFk(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		if(info.value){
			const item = await lastValueFrom(this.projectLocationLookupService.getItemByKey({ id : info.value as number}));
			if(item){
				return this.reactOnLeadingStructure(info, item, EstimateMainParamStructureConstant.Location, 'AotRel');
			}
		}
		return new ValidationResult();
	}

	/**
	 * validate MdcControllingUnitFk
	 * @param info
	 */
	public async asyncValidateMdcControllingUnitFk(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		if(info.value) {
			const item = await lastValueFrom(this.controllingUnitLookupService.getItemByKey({id: info.value as number}));
			if(item){
				return this.reactOnLeadingStructure(info, item as unknown as LineItemLeadingStructureItem, EstimateMainParamStructureConstant.ControllingUnits, 'GtuRel');
			}
		}
		return new ValidationResult();
	}

	public validateBoqItemFk(info: ValidationInfo<IEstLineItemEntity>): ValidationResult {
		const item = {} as IBoqItemEntity; //$injector.get('estimateMainBoqItemService').getItemById(info.value);
		const result = { apply: true, valid: true, error: '' };

		if (info.value === 0 || info.value === null) {
			info.entity.BoqItemFk = null;
			info.entity.BoqHeaderFk = null;
		}

		const boqLineTypes = [0, 11, 200, 201, 202, 203];
		if (item && !boqLineTypes.includes(item.BoqLineTypeFk)) {
			result.valid = false;
			result.error = this.translate.instant('estimate.main.SelectBoqItemError').text;
		}

		if (item && item.Id && item.BoqLineTypeFk === 0) {
			if (_.isArray(item.BoqItems) && item.BoqItems.length > 0) {
				const crbChildrens = _.filter(item.BoqItems, { 'BoqLineTypeFk': 11 });
				if (crbChildrens && crbChildrens.length) {
					result.valid = false;
					result.error = this.translate.instant('estimate.main.subQuantityBoQItemsErrormsg').text;
				}
			}
		}

		return result;
	}

	public validateWicBoqItemFk(info: ValidationInfo<IEstLineItemEntity>): ValidationResult {
		const item = {} as IBoqItemEntity;//$injector.get('boqWicItemService').getItemByIdAsync(value);
		const result = { apply: true, valid: true, error: '' };
		const entity = info.entity;

		if (info.value === 0 || info.value === null) {
			entity.BoqWicCatFk = null;
			entity.WicBoqHeaderFk = null;
		}

		const boqLineTypes = [0, 11, 200, 201, 202, 203]; // boq position(0) and surcharge(200, 201, 202, 203) can assign to line item.
		if (item && boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
			result.valid = false;
			result.error = this.translate.instant('estimate.main.SelectBoqItemError').text;
		}

		if (item && item.Id && item.BoqLineTypeFk === 0) {
			// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
			if (_.isArray(item.BoqItems) && item.BoqItems.length > 0) {

				const crbChildrens = _.filter(item.BoqItems, { 'BoqLineTypeFk': 11 });
				if (crbChildrens && crbChildrens.length) {
					result.valid = false;
					result.error = this.translate.instant('estimate.main.subQuantityBoQItemsErrormsg').text;
				}
			}
		}

		return result;
	}

	public asyncValidateBoqItemFk(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		const item = {} as LineItemLeadingStructureItem; //= $injector.get('estimateMainBoqItemService').getItemById(value);
		const entity = info.entity;
		const result = { apply: true, valid: true, error: '' };
		const isBoqSplitQuantityLinked = entity.BoqSplitQuantityFk !== null;
		if (isBoqSplitQuantityLinked && entity.BoqItemFk !== info.value) {
			entity.BoqHeaderFk = entity.OldBoqHeaderFk;
			const errorMessage = this.translate.instant('estimate.main.BoqSplitQuantityFkExist').text;
			const headerMessage = this.translate.instant('estimate.main.BoqSplitQuantityFkExistHeaderInfo').text;
			this.messageBoxService.showMsgBox(errorMessage, headerMessage, 'info');
			return Promise.resolve({
				apply: false,
				valid: true,
				error: errorMessage
			});
		}

		if (item && item.Id) {
			//TODO: waiting for estimateMainBoqService
			// let boqHeaderList = $injector.get('estimateMainBoqService').getBoqHeaderEntities();
			// let boqHeader = _.find(boqHeaderList, {'Id': item.BoqHeaderFk});
			// if (boqHeader) {
			// 	entity.IsGc = boqHeader.IsGCBoq;
			// }
			//
			// entity.IsOptional = entity.IsGc ? false : estimateMainBoqService.IsLineItemOptional(item);
			// entity.IsOptionalIT = entity.IsGc ? false : estimateMainBoqService.IsLineItemOptionalIt(item);

			const readData: {
				EstHeaderFk: number,
				EstLineItemFk: number,
				Data: { EstHeaderFk: number, EstLineItemFk: number }[]
			} = {
				'EstHeaderFk': entity.EstHeaderFk,
				'EstLineItemFk': entity.Id,
				'Data': []
			};
			readData.Data.push({ EstHeaderFk: entity.EstHeaderFk, EstLineItemFk: entity.Id });

			// if (item.BoqLineTypeFk === 11 && [1, 4, 6, 7].includes(entity.EstQtyRelBoqFk)){
			// 	let output = [];
			// 	let data = _.map($injector.get('basicsLookupdataLookupDescriptorService').getData('boqItemFk'),function (item) {
			// 		return item;
			// 	});
			// 	$injector.get('cloudCommonGridService').flatten(data, output, 'BoqItems');
			// 	let parentBoqItem = _.find(output, {'Id': item.BoqItemFk});
			// 	if(parentBoqItem){
			// 		item.BasUomFk = parentBoqItem.BasUomFk;
			// 	}
			// }

			return new Promise<ValidationResult>(resolve => {
				this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/listbyselection', readData).subscribe(response => {
					const lineItem2MdlObjs = response as IEstLineItem2MdlObjectEntity[];
					this.updateQuantityUomOnBoQ(entity, item, EstimateMainParamStructureConstant.BoQs, lineItem2MdlObjs);
					resolve(result);
				});
			});
		} else {
			entity.IsGc = false;
			entity.GrandTotal = entity.IsIncluded || (entity.IsOptional && !entity.IsOptionalIT) ? 0 : entity.CostTotal + entity.MarkupCostTotal + entity.Allowance;
			return this.resolveResourceByIsGCChanging(entity);
		}
	}

	public resolveResourceByIsGCChanging(entity: IEstLineItemEntity): Promise<ValidationResult> {
		const resourceList = this.getResourcesOfLineItem();
		const lineItemResources = resourceList && resourceList.length ? _.filter(resourceList, {
			EstLineItemFk: entity.Id,
			EstHeaderFk: entity.EstHeaderFk
		}) : [];
		const projectId = this.estimateMainContextService.getProjectId();
		const retVal = { apply: true, valid: true, error: '' };

		if (lineItemResources.length === 0) {
			return new Promise(resolve => {
				this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/resource/resolveResourceByIsGCChanging?' + 'lineItemId=' + entity.Id + '&headerId=' + entity.EstHeaderFk + '&isGc=' + entity.IsGc + '&projectId=' + projectId, {}).subscribe(response => {
					const newResourceList = response as IEstResourceEntity[];
					this.estimateMainResourceService.setList(newResourceList);
					this.setIsIndirectCost(entity, newResourceList);

					//$injector.get('estimateMainDynamicUserDefinedColumnService').setReAttachDataToResource(true);
					this.estimateMainCommonService.calculateLineItemAndResources(entity, newResourceList);
					this.estimateMainService.setModified(entity);
					resolve(retVal);
				});
			});
		} else {
			this.estimateMainService.setModified(entity);
			this.estimateMainResourceService.setList(lineItemResources);
			this.setIsIndirectCost(entity, lineItemResources);
			this.estimateMainCommonService.calculateLineItemAndResources(entity, lineItemResources);
			return Promise.resolve(retVal);
		}
	}

	public reactOnLeadingStructure(info: ValidationInfo<IEstLineItemEntity>, item: LineItemLeadingStructureItem, structureConstant: EstimateMainParamStructureConstant, qtyRel: string): Promise<ValidationResult> {
		const result = { apply: true, valid: true, error: '' };
		if (info.value === 0) {
			_.set(info.entity, info.field, null);
		}
		if (item && item.Id) {
			return this.updateQuantityByStructureSorting(info.entity, item, structureConstant, qtyRel).then(() => {
				return result;
			});
		} else {
			return Promise.resolve(result);
		}
	}

	public updateQuantityByStructureSorting(entity: IEstLineItemEntity, item: LineItemLeadingStructureItem, structureFk: EstimateMainParamStructureConstant, qtyRel: string) {
		if (this.isUpdateQuantityByStructureSorting(entity, item, structureFk)) {
			this.updateQuantities(entity, item, qtyRel);
		}
		this.setQuantityTarget(entity);
		return this.calculateLineItemAndResources(entity, false);
	}

	private calculateStandardAllowance(entity: IEstLineItemEntity) {
		if (!entity) {
			return;
		}

		//TODO
		//let resourceList = $injector.get('estimateMainResourceService').getList();
		//$injector.get('estimateMainStandardAllowanceCalculationService').calculateStandardAllowance(entity, resourceList || []);
	}

	public validateIsOptional(info: ValidationInfo<IEstLineItemEntity>) {
		if (info.value) {
			info.entity.AdvancedAllUnit = 0;
		} else {
			info.entity.IsOptionalIT = false;
		}
		info.entity.forceBudgetCalc = !info.value && !info.entity.IsDisabled;
		this.calculateLineItemAndResources(info.entity);
		this.processService.setReadonlyWithIsOptionalChange(info.entity, info.value as boolean);
		return { valid: true, apple: true };
	}

	public validateIsNoMarkup(info: ValidationInfo<IEstLineItemEntity>) {
		info.entity.originalAdvancedAllUnit = info.entity.AdvancedAllUnit;
		info.entity.originalManualMarkupUnit = info.entity.ManualMarkupUnit;
		info.entity.AdvancedAllUnit = 0;
		info.entity.AdvancedAllUnitItem = 0;
		info.entity.AdvancedAll = 0;
		info.entity.URDUnitItem = 0;
		info.entity.ManualMarkupUnit = 0;
		info.entity.ManualMarkupUnitItem = 0;
		info.entity.ManualMarkup = 0;
		info.entity.IsNoMarkup = info.value as boolean;
		if (info.value) {
			info.entity.GcUnitItem = info.entity.GcUnit = info.entity.Gc = 0;
			info.entity.GaUnitItem = info.entity.GaUnit = info.entity.Ga = 0;
			info.entity.AmUnitItem = info.entity.AmUnit = info.entity.Am = 0;
			info.entity.RpUnitItem = info.entity.RpUnit = info.entity.Rp = 0;
			info.entity.Allowance = info.entity.AllowanceUnitItem = info.entity.AllowanceUnit = 0;
			info.entity.Fm = 0;
			info.entity.GrandTotal = info.entity.CostTotal;
			info.entity.GrandCostUnitTarget = info.entity.CostUnitTarget;
			info.entity.GrandCostUnit = info.entity.CostUnit;
			info.entity.URD = 0;
		}
		this.processService.setReadonlyWithIsNoMarkupChange(info.entity, info.value as boolean);
		return { valid: true, apple: true };
	}

	// private validateBasUomFk(){
	// 	return estimateMainCommonService.isLumpsumUom(item.BasUomFk).then(function (isLsumUom) {
	// 		if (isLsumUom) {
	// 			estimateMainCommonService.setQuantityByLsumUom(item, false, isLsumUom);
	// 			estimateMainCommonService.calculateLineItemAndResources(item, resourceList);
	//
	// 			angular.forEach(resourceList, function (res) {
	// 				estimateMainResourceService.markItemAsModified(res);
	// 			});
	// 			$injector.get('estimateMainLineItemProcessor').processItem(item);
	// 			return $q.when();
	// 		}
	// 		else if (item.BasUomFk) {
	// 			return estimateMainDurationCalculatorService.getDuration(item).then(function (result) {
	// 				let qty = result;
	// 				if (qty > 0 && qty !== item.Quantity) {
	// 					item.Quantity = qty;
	// 					item.QuantityDetail = qty.toString();
	// 					calcLineItemResNDynamicCol(field, item, resourceList);
	// 				}
	// 				return $q.when();
	// 			});
	// 		}
	// 		return $q.when();
	// 	});
	// }

	public validateIsFixedPrice(info: ValidationInfo<IEstLineItemEntity>) {
		this.processService.setReadonlyWithIsFixedPriceChange(info.entity, info.value as boolean);
		return { valid: true, apple: true };
	}

	public validateIsGc(info: ValidationInfo<IEstLineItemEntity>) {
		this.processService.setPropertiesReadonly(info.entity, ['IsFixedPrice'], info.value as boolean);
		this.processService.setReadonlyWithIsGcChange(info.entity, info.value as boolean);
		if (info.value) {
			info.entity.AdvancedAllUnit = 0;
			info.entity.AdvancedAllUnitItem = 0;
			info.entity.AdvancedAll = 0;
			info.entity.ManualMarkupUnit = 0;
			info.entity.ManualMarkupUnitItem = 0;
			info.entity.ManualMarkup = 0;
			info.entity.IsOptionalIT = !info.value;
			info.entity.IsOptional = !info.value;
			this.processService.setPropertiesReadonly(info.entity, ['IsOptionalIT'], info.value as boolean);
		}
		this.processService.setPropertiesReadonly(info.entity, ['IsOptional'], info.value as boolean);
		this.calculateLineItemAndResources(info.entity, false, true);

		return { valid: true, apple: true };
	}

	public validateGrandCostUnitTarget(info: ValidationInfo<IEstLineItemEntity>) {
		if (info.value) {
			info.entity.GrandCostUnitTarget = info.value as number;
		}
		this.calculateStandardAllowance(info.entity);
		return { valid: true, apple: true };
	}

	public validateManualMarkupUnit(info: ValidationInfo<IEstLineItemEntity>) {
		if (info.value) {
			info.entity.ManualMarkupUnit = info.value as number;
			this.calculateStandardAllowance(info.entity);
		}
		return { valid: true, apple: true };
	}

	private validateEstLineItemFk() {
		//TODO: <estimateMainRefLineItemService>/<setRefLineItem>
		//estimateMainRefLineItemService.setRefLineItem(item, mainItemList);
		return { valid: true, apple: true };
	}

	public validateIsDisabled(info: ValidationInfo<IEstLineItemEntity>) {
		info.entity.forceBudgetCalc = !info.entity.IsOptional && !info.value;
		this.calculateLineItemAndResources(info.entity, false, false);
		return { valid: true, apple: true };
	}

	public validateIsFixedBudget(info: ValidationInfo<IEstLineItemEntity>) {
		this.processService.process(info.entity);
		return { valid: true, apple: true };
	}

	public validateIsFixedBudgetUnit(info: ValidationInfo<IEstLineItemEntity>) {
		this.processService.process(info.entity);
		return { valid: true, apple: true };
	}

	public validateBudgetUnit(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		const projectId = this.estimateMainContextService.getSelectedProjectId();
		const resourceList = this.getResourcesOfLineItem();
		return this.budgetCalculationService.calculateBudget(info.entity, info.field, projectId, resourceList, info.entity).then(function() {
			return { apply: true, valid: true };
		});
	}

	public validateBudget(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		const projectId = this.estimateMainContextService.getSelectedProjectId();
		const resourceList = this.getResourcesOfLineItem();
		return this.budgetCalculationService.calculateBudget(info.entity, info.field, projectId, resourceList, info.entity).then(function() {
			return { apply: true, valid: true };
		});
	}

	private isUpdateQuantityByStructureSorting(entity: IEstLineItemEntity, item: LineItemLeadingStructureItem, structureFk: EstimateMainParamStructureConstant): boolean {
		let retVal = false;
		const estConfigData = this.estimateMainContextService.getEstimateReadData();
		if (estConfigData && estConfigData.EstStructureDetails && estConfigData.EstStructureDetails.length) {
			const lessSortingStructureItems = this.getSortingStructureItems(item, structureFk) || [];
			const sourceItemFk = this.getLessSortingLeadingStructureExist(entity, lessSortingStructureItems);
			if (!sourceItemFk) {
				retVal = true;
			}
		} else {
			retVal = true;
		}
		return retVal;
	}

	private getSortingStructureItems(item: LineItemLeadingStructureItem, structureFk: EstimateMainParamStructureConstant): IEstStructureDetailBaseEntity[] | null {
		const estConfigData = this.estimateMainContextService.getEstimateReadData();
		if (estConfigData && estConfigData.EstStructureDetails) {
			let sourceStructureItem: IEstStructureDetailBaseEntity | null | undefined = null;
			if (structureFk === EstimateMainParamStructureConstant.EnterpriseCostGroup || structureFk === EstimateMainParamStructureConstant.ProjectCostGroup) {
				sourceStructureItem = _.find(estConfigData.EstStructureDetails, { Code: item.Code });
			} else {
				sourceStructureItem = _.find(estConfigData.EstStructureDetails, { EstStructureFk: structureFk });
			}
			if (sourceStructureItem) {
				return _.filter(estConfigData.EstStructureDetails, function(item) {
					return item.Sorting < sourceStructureItem!.Sorting;
				}) as IEstStructureDetailBaseEntity[];
			} else {
				return estConfigData.EstStructureDetails;
			}
		}
		return [];
	}

	private setQuantityTarget(entity: IEstLineItemEntity) {
		entity.QuantityTargetDetail = entity.QuantityTarget.toString();
		entity.WqQuantityTargetDetail = entity.WqQuantityTarget.toString();
		if (entity.IsGc || entity.IsIncluded) {
			entity.GrandTotal = 0;
		}
	}

	private getLessSortingLeadingStructureExist(entity: IEstLineItemEntity, structureItems: IEstStructureDetailBaseEntity[] | null): number | null {
		let sourceItemFk: number | null = null;
		// let allCostGroupCatalogs = {};
		// let enterpriseCostGroupCatalogs = {};

		if (structureItems) {
			structureItems.forEach(tempStructureItem => {
				if (!sourceItemFk) {
					switch (tempStructureItem.EstStructureFk) {
						case EstimateMainParamStructureConstant.BoQs:
							if (entity.BoqItemFk) {
								sourceItemFk = entity.BoqItemFk;
							}
							break;
						case EstimateMainParamStructureConstant.ActivitySchedule:
							if (entity.PsdActivityFk) {
								sourceItemFk = entity.PsdActivityFk;
							}
							break;
						case EstimateMainParamStructureConstant.Location:
							if (entity.PrjLocationFk) {
								sourceItemFk = entity.PrjLocationFk;
							}
							break;
						case EstimateMainParamStructureConstant.ControllingUnits:
							if (entity.MdcControllingUnitFk) {
								sourceItemFk = entity.MdcControllingUnitFk;
							}
							break;
						// case EstimateMainParamStructureConstant.ProjectCostGroup:
						// 	allCostGroupCatalogs = $injector.get('basicsLookupdataLookupDescriptorService').getData('costGroupCatalogs');
						// 	if (allCostGroupCatalogs && _.size(allCostGroupCatalogs) > 0) {
						// 		let allPrjCostGroupCatalogs = _.filter(allCostGroupCatalogs, function (item) {
						// 			return item.ProjectFk && !item.LineItemContextFk && item.Code === tempStructureItem.Code;
						// 		});
						// 		let lineItemPrjCostGroupCatalogs = _.filter(allPrjCostGroupCatalogs, function (item) {
						// 			return !!entity['costgroup_' + item.Id];
						// 		});
						// 		if (lineItemPrjCostGroupCatalogs.length >= 1) {
						// 			sourceItemFk = lineItemPrjCostGroupCatalogs[0];
						// 		}
						// 	}
						// 	break;
						// case EstimateMainParamStructureConstant.EnterpriseCostGroup:
						// 	enterpriseCostGroupCatalogs = $injector.get('basicsLookupdataLookupDescriptorService').getData('costGroupCatalogs');
						// 	if (enterpriseCostGroupCatalogs && _.size(enterpriseCostGroupCatalogs) > 0) {
						// 		let enterpriseCostGroups = _.filter(enterpriseCostGroupCatalogs, function (item) {
						// 			return !item.ProjectFk && item.LineItemContextFk && item.Code === tempStructureItem.Code;
						// 		});
						// 		let entcostGroups = _.filter(enterpriseCostGroups, function (item) {
						// 			return !!entity['costgroup_' + item.Id];
						// 		});
						// 		if (entcostGroups.length >= 1) {
						// 			sourceItemFk = entcostGroups[0];
						// 		}
						// 	}
						// 	break;
					}
				}
			});
		}

		return sourceItemFk;
	}

	private updateQuantities(entity: IEstLineItemEntity, sourceItem: LineItemLeadingStructureItem, qtyRel: string) {
		if (entity.HasSplitQuantities) {
			return;
		}
		const quantity = sourceItem.Quantity || sourceItem.QuantityAdj;
		const uomFk = sourceItem.BasUomFk || sourceItem.UomFk || sourceItem.QuantityUoMFk || sourceItem.UoMFk;
		switch (qtyRel) {
			case 'BoqRel':
				if (entity.EstQtyRelBoqFk === 1 || entity.EstQtyRelBoqFk === 4 || entity.EstQtyRelBoqFk === 6 || entity.EstQtyRelBoqFk === 7) {
					entity.BoqItemFk = sourceItem.Id;
					entity.QuantityTarget = sourceItem.QuantityAdj ?? 1;
					entity.WqQuantityTarget = sourceItem.Quantity ?? 1;
					entity.BasUomTargetFk = !sourceItem.IsBoqSplitQuantity ? sourceItem.BasUomFk : entity.BasUomTargetFk;
					entity.BasUomFk = !entity.BasUomFk ? (!sourceItem.IsBoqSplitQuantity ? sourceItem.BasUomFk : entity.BasUomFk) : entity.BasUomFk;
				}
				break;
			case 'ActRel':
				if (entity.EstQtyRelActFk === 1 || entity.EstQtyRelActFk === 4 || entity.EstQtyRelActFk === 6 || entity.EstQtyRelActFk === 7) {
					entity.QuantityTarget = quantity ?? 1;
					entity.BasUomTargetFk = uomFk;
					entity.WqQuantityTarget = quantity ?? 1;
					entity.BasUomFk = !entity.BasUomFk ? uomFk : entity.BasUomFk;
				}
				break;
			case 'GtuRel':
				if (entity.EstQtyRelGtuFk === 1 || entity.EstQtyRelGtuFk === 4 || entity.EstQtyRelGtuFk === 6 || entity.EstQtyRelGtuFk === 7) {
					entity.QuantityTarget = quantity ?? 1;
					entity.BasUomTargetFk = uomFk;
					entity.WqQuantityTarget = quantity ?? 1;
					entity.BasUomFk = !entity.BasUomFk ? uomFk : entity.BasUomFk;
				}
				break;
			case 'AotRel':
				if (entity.EstQtyTelAotFk === 1 || entity.EstQtyTelAotFk === 4 || entity.EstQtyTelAotFk === 6 || entity.EstQtyTelAotFk === 7) {
					entity.QuantityTarget = quantity ?? 1;
					entity.WqQuantityTarget = quantity ?? 1;
					// eslint-disable-next-line no-prototype-builtins
					if (!sourceItem.hasOwnProperty('LocationParentFk')) {
						entity.BasUomTargetFk = uomFk;
						entity.BasUomFk = !entity.BasUomFk ? uomFk : entity.BasUomFk;
					}
					if (entity.DescriptionInfo && !entity.DescriptionInfo.Translated && sourceItem.DescriptionInfo) {
						entity.DescriptionInfo.Translated = sourceItem.DescriptionInfo.Translated;
						entity.DescriptionInfo.Modified = true;
					}
				}
				break;
		}
		entity.BasUomTargetFk = entity.BasUomTargetFk ? entity.BasUomTargetFk : 0;
		entity.BasUomFk = entity.BasUomFk ? entity.BasUomFk : 0;
		this.estimateMainCommonService.setQuantityByLsumUom(entity, true);
		this.processService.process(entity);
	}

	private setIsIndirectCost(entity: IEstLineItemEntity, resources: IEstResourceEntity[]) {
		resources.forEach((res) => {
			if (res.IsIndirectCost != entity.IsGc) {
				res.IsIndirectCost = entity.IsGc;
				this.estimateMainResourceService.setModified([res]);
			}
		});
	}

	private updateQuantityUomOnBoQ(entity: IEstLineItemEntity, item: LineItemLeadingStructureItem, structureFk: number, mdlObjects?: IEstLineItem2MdlObjectEntity[] | null) {
		const estConfigData = this.estimateMainContextService.getEstimateReadData();
		if (estConfigData && estConfigData.EstStructureDetails && estConfigData.EstStructureDetails.length >= 1) {
			const structureItems = this.getSortingStructureItems(item, structureFk);
			this.getBoQBasedOnSort(entity, item, structureFk, structureItems, mdlObjects);
		} else {
			this.updateQuantities(entity, item, 'BoqRel');
		}
	}

	private getBoQBasedOnSort(entity: IEstLineItemEntity, item: LineItemLeadingStructureItem, structureFk: number, lessSortingStructureItems: IEstStructureDetailBaseEntity[] | null, mdlObjects?: IEstLineItem2MdlObjectEntity[] | null) {
		let sourceItemFk;
		const successResult = { apply: true, valid: true, error: '' };
		const isBoqSplitQuantityLinked = entity.BoqSplitQuantityFk !== null;
		if (isBoqSplitQuantityLinked && entity.BoqItemFk !== item.Id) {
			const errorMessage = this.translate.instant('estimate.main.BoqSplitQuantityFkExist').text;
			const headerMessage = this.translate.instant('estimate.main.BoqSplitQuantityFkExistHeaderInfo').text;
			this.messageBoxService.showMsgBox(errorMessage, headerMessage, 'info');
			return {
				apply: false,
				valid: true,
				error: errorMessage
			};
		}

		entity.BoqItemFk = item.Id;

		// eslint-disable-next-line no-prototype-builtins
		if (!item.hasOwnProperty('BoqLineTypeFk') && !item.hasOwnProperty('IsBoqSplitQuantity')) {
			return successResult;
		}

		if (mdlObjects && mdlObjects.length > 0) {
			let quantityUpdated = false;
			_.forEach(mdlObjects, function(mdlObject) {
				if (mdlObject.Quantity && mdlObject.QuantityTarget && mdlObject.WqQuantityTarget) {
					quantityUpdated = true;
				}
			});
			if (!quantityUpdated) {
				sourceItemFk = this.getLessSortingLeadingStructureExist(entity, lessSortingStructureItems);
				if (!sourceItemFk) {
					this.updateQuantities(entity, item, 'BoqRel');
				}
			}
		} else {
			sourceItemFk = this.getLessSortingLeadingStructureExist(entity, lessSortingStructureItems);
			if (!sourceItemFk) {
				this.updateQuantities(entity, item, 'BoqRel');
			}
		}
		return successResult;
	}

	/**
	 * Quantity, Factor, Quantity Detail, Factor Detail Validation function
	 * lineItem And Resource calculation, then mark the lineItem and Resource as Modification
	 */
	private detailPropValidate(detailRelProp: keyof IEstLineItemEntity) {
		return (info: ValidationInfo<IEstLineItemEntity>) => {
			this.estimateMainDetailCalculationService.calculateDetailProp(info.entity, info.value as string, detailRelProp);
			return this.valueChangeValidation(info);
		};
	}

	private detailRelPropValidation(detailProp: keyof IEstLineItemEntity) {
		return (info: ValidationInfo<IEstLineItemEntity>) => {
			this.estimateMainDetailCalculationService.calculateDetailRelProp(info.entity, info.value as number, detailProp);
			return this.valueChangeValidation(info);
		};
	}

	private calculateInternal(entity: IEstLineItemEntity, resources: IEstResourceEntity[], getResourcesByLineItems: boolean) {
		if (entity && resources && resources.length) {
			this.estimateMainResourceService.setList(resources);
			//TODO: <estimateMainDynamicUserDefinedColumnService> missing
			//$injector.get('estimateMainDynamicUserDefinedColumnService').setReAttachDataToResource(!getResourcesByLineItems);
			this.calculateLineItemAndResources(entity, false, true);
		}
		this.estimateMainService.setModified(entity);
	}

	public calculateLineItemAndResources(entity: IEstLineItemEntity, isBoQ: boolean = false, setIsIndirectCost: boolean = true): Promise<boolean> {
		const resourceList = this.getResourcesOfLineItem();
		const lineItemResources = resourceList && resourceList.length ? _.filter(resourceList, {
			EstLineItemFk: entity.Id,
			EstHeaderFk: entity.EstHeaderFk
		}) : [];
		const projectId = this.estimateMainContextService.getProjectId();
		if (lineItemResources.length !== 0) {
			this.estimateMainService.setModified(entity);
			this.estimateMainResourceService.setList(lineItemResources);
			if (isBoQ || setIsIndirectCost) {
				this.setIsIndirectCost(entity, lineItemResources);
			}
			this.estimateMainCommonService.calculateLineItemAndResources(entity, lineItemResources);
			return Promise.resolve(true);
		} else if (isBoQ) {
			return new Promise<boolean>(resolve => {
				this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/resource/resolveResourceByIsGCChanging?' + 'lineItemId=' + entity.Id.toString() + '&headerId=' + entity.EstHeaderFk + '&isGc=' + entity.IsGc + '&projectId=' + projectId, {}).subscribe(response => {
					const resources = response as IEstResourceEntity[];
					this.setQuantityTarget(entity);
					this.calculateInternal(entity, resources, true);
					resolve(true);
				});
			});
		} else {
			return new Promise<boolean>(resolve => {
				this.getResourcesFromRemote(entity).subscribe(response => {
					const resources = _.get(response, 'dtos', []) as IEstResourceEntity[];
					// load user defined column value
					//TODO: dynamic columns
					// let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
					// let udpData = response && response.data && response.data.dynamicColumns && _.isArray(response.data.dynamicColumns.ResoruceUDPs) ? response.data.dynamicColumns.ResoruceUDPs : [];
					// if (newResourceList.length > 0 && udpData.length > 0) {
					// 	estimateMainResourceDynamicUserDefinedColumnService.attachUpdatedValueToColumn(newResourceList, udpData, false);
					// }
					this.setQuantityTarget(entity);
					this.calculateInternal(entity, resources, false);
					resolve(true);
				});
			});
		}
	}

	private getResourcesFromRemote(entity: IEstLineItemEntity) {
		return this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/resource/getlistbylineitems', {
			estLineItemFks: [entity.Id],
			estHeaderFk: this.estimateMainContextService.getSelectedEstHeaderId(),
			projectId: this.estimateMainContextService.getProjectId()
		});
	}

	private valueChangeValidation(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		const validResult = {
			apply: false,
			valid: true,
			error: ''
		};

		const entity = info.entity;
		_.set(entity, info.field, info.value);

		//calculate reference lineItem
		if (entity.EstLineItemFk) {
			return this.estimateMainRefLineItemService.getRefBaseResources(entity, false).then(resources => {
				this.calcLineItemResNDynamicCol(entity, resources);
				return validResult;
			});
		} else {
			const allResources = this.getResourcesOfLineItem();

			//get resources of current lineItem
			const resourceList = allResources && allResources.length ? _.filter(allResources, {
				EstLineItemFk: entity.Id,
				EstHeaderFk: entity.EstHeaderFk
			}) : [];
			if (resourceList.length) {
				this.calcLineItemResNDynamicCol(entity, resourceList);
				return Promise.resolve(validResult);
			} else {
				return new Promise(resolve => {
					this.getResourcesFromRemote(entity).subscribe(response => {
						//const resources = _.get(response, 'dtos', []) as IEstResourceEntity[];
						// load user defined column value
						//TODO: dynamic columns
						// let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
						// let udpData = response && response.data && response.data.dynamicColumns && _.isArray(response.data.dynamicColumns.ResoruceUDPs) ? response.data.dynamicColumns.ResoruceUDPs : [];
						// if (newResourceList.length > 0 && udpData.length > 0) {
						// 	estimateMainResourceDynamicUserDefinedColumnService.attachUpdatedValueToColumn(newResourceList, udpData, false);
						// }
						this.estimateMainResourceService.setList(resourceList);
						this.calcLineItemResNDynamicCol(entity, resourceList);
						resolve(validResult);
					});
				});
			}
		}
	}

	// calculate line item on change of any type of quantity, details, cost factors, lumpsum, fromdate or todate fields
	// calculate resources of line item
	// recalculate the dynamic column values
	// refresh items
	private calcLineItemResNDynamicCol(item: IEstLineItemEntity, resourceList: IEstResourceEntity[]) {
		item.forceBudgetCalc = !item.IsOptional && !item.IsDisabled;

		/* calculate quantity and cost of lineItem and resources */
		this.estimateMainCommonService.calculateLineItemAndResources(item, resourceList);

		/* mark resources as modified */
		if (item.Id && item.EstLineItemFk === null && resourceList.length > 0) {
			this.estimateMainResourceService.setModified(resourceList);
		} else {
			//item.EstResources = [];
		}

		/* render the lineItem and resource to screen */
		//refresh(item);
	}

	private getResourcesOfLineItem(): IEstResourceEntity[] {
		return this.estimateMainResourceService.getList();
	}
}