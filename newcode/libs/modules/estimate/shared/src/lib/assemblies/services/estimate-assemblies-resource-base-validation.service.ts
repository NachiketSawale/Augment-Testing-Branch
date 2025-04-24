/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateMainResourceType } from '../../common/enums/estimate-main-resource-type.enum';
import {
	BasicsSharedDataValidationService,
	BasicsSharedMaterialSearchService, MaterialSearchRequest
} from '@libs/basics/shared';
import { inject } from '@angular/core';
import {
	EstimateMainResourceCodeSettingService
} from '../../common/services/estimate-main-resource-code-setting.service';
import { EstimateMainExchangeRateService } from '../../common/services/estimate-main-exchange-rate.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { AssemblyCalculationService } from './../../calculation/services/assembly-calculation.service';
import { ICostCodeEntity } from '@libs/basics/interfaces';
import { IAssemblyDataService, IAssemblyResourceDataService } from '../model/assembly-data-service.interface';
import { AssemblyType, IEstAssemblyTypeEntity } from '@libs/estimate/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { lastValueFrom, Observable } from 'rxjs';
import { EstimateMainResourceTypeService } from '../../common/services/estimate-main-resource-type.service';
import { EstimateMainDetailValidationService } from '../../common/services/estimate-main-detail-validation.service';
import { EstimateMainDetailCalculationService } from '../../common/services/estimate-main-detail-calculation.service';
import { set } from 'lodash';

/**
 * base assembly resource validation, if you need to use in project assembly or plant assembly, please inherit from this class, and override some methods
 */
export class EstimateAssembliesResourceBaseValidationService extends BaseValidationService<IEstResourceEntity> {
	protected readonly http = inject(HttpClient);
	protected readonly platformConfigurationService = inject(PlatformConfigurationService);
	protected readonly estimateMainExchangeRateService = inject(EstimateMainExchangeRateService);
	protected readonly assemblyCalculationService = inject(AssemblyCalculationService);
	protected readonly materialLookupService = inject(BasicsSharedMaterialSearchService);
	protected readonly resourceTypeService = inject(EstimateMainResourceTypeService);
	protected readonly estimateMainDetailCalculationService = inject(EstimateMainDetailCalculationService);
	protected readonly estimateMainDetailValidationService = inject(EstimateMainDetailValidationService);
	protected readonly basicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	protected readonly resourceCodeSettingService = inject(EstimateMainResourceCodeSettingService);

	/**
	 * constructor
	 * @param assemblyDataService
	 * @param dataService
	 */
	public constructor(
		protected assemblyDataService: IAssemblyDataService,
		protected dataService: IAssemblyResourceDataService
	) {
		super();
	}

	/**
	 * get data service
	 * @protected
	 */
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstResourceEntity> {
		return this.dataService;
	}

	/**
	 * generate validation functions
	 * @protected
	 */
	protected generateValidationFunctions(): IValidationFunctions<IEstResourceEntity> {
		const validationFunctions = this.generateIsMandatoryFunctions();
		return {
			EstResourceTypeShortKey: [this.validateEstResourceTypeShortKey],//TODO-Walt: asyncValidateEstResourceTypeShortKey
			Code: [this.validateCode, this.asyncValidateCode],
			DescriptionInfo: [this.validateDescriptionInfo],
			BasUomFk: [this.validateIsMandatory],
			IsDisabled: [this.validateIsDisabled],
			WorkOperationTypeFk: this.asyncValidateWorkOperationTypeFk,
			QuantityDetail: this.generateDetailPropValidation('Quantity'),
			QuantityFactorDetail1: this.generateDetailPropValidation('QuantityFactor1'),
			QuantityFactorDetail2: this.generateDetailPropValidation('QuantityFactor2'),
			ProductivityFactorDetail: this.generateDetailPropValidation('ProductivityFactor'),
			CostFactorDetail1: this.generateDetailPropValidation('CostFactor1'),
			CostFactorDetail2: this.generateDetailPropValidation('CostFactor2'),
			EfficiencyFactorDetail1: this.generateDetailPropValidation('EfficiencyFactor1', true),
			EfficiencyFactorDetail2: this.generateDetailPropValidation('EfficiencyFactor2', true),
			Quantity: this.generateDetailRelPropValidation('QuantityDetail'),
			QuantityFactor1: this.generateDetailRelPropValidation('QuantityFactorDetail1'),
			QuantityFactor2: this.generateDetailRelPropValidation('QuantityFactorDetail2'),
			CostFactor1: this.generateDetailRelPropValidation('CostFactorDetail1'),
			CostFactor2: this.generateDetailRelPropValidation('CostFactorDetail2'),
			ProductivityFactor: this.generateDetailRelPropValidation('ProductivityFactorDetail'),
			EfficiencyFactor1: this.generateDetailRelPropValidation('EfficiencyFactorDetail1', true),
			EfficiencyFactor2: this.generateDetailRelPropValidation('EfficiencyFactorDetail2', true),
			...validationFunctions
		};
	}

	/**
	 * generate IsMandatory functions
	 * @protected
	 */
	protected generateIsMandatoryFunctions():IValidationFunctions<IEstResourceEntity>{
		const validationFunctions : IValidationFunctions<IEstResourceEntity> = {};
		['BasUomFk',
			'QuantityFactor3',
			'QuantityFactor4',
			'QuantityFactorCc',
			'QuantityReal',
			'QuantityInternal',
			'QuantityTotal',
			'CostFactorCc',
			'CostUnitSubItem',
			'CostUnitLineItem',
			'CostUnitTarget',
			'CostTotal',
			'CostUnit',
			'HoursUnit',
			'HoursUnitSubItem',
			'HoursUnitLineItem',
			'HoursUnitTarget',
			'HoursTotal'].forEach(field =>{
			validationFunctions[field] = this.validateIsMandatory;
		});
		return validationFunctions;
	}

	/**
	 * generate detail property validation function.
	 * @param detailRelProp
	 * @param checkZeroError whether the value can be zero
	 * @private
	 */
	private generateDetailPropValidation(detailRelProp: keyof IEstResourceEntity, checkZeroError?: boolean) {
		return async (info: ValidationInfo<IEstResourceEntity>) => {
			let result = this.estimateMainDetailValidationService.mapCultureValidation(info);
			if(checkZeroError && result.valid){
				result = this.divisionByZeroError(info);
			}
			if(result.valid){
				this.estimateMainDetailCalculationService.calculateDetailProp(info.entity, info.value as string, detailRelProp);
				this.basicsSharedDataValidationService.applyValidationResult(this.dataService, { entity: info.entity, field: detailRelProp, result: new ValidationResult() });
				await this.calculateResource(info.entity);
			}
			return result;
		};
	}

	/**
	 * generate detail relate property validation function.
	 * @param detailProp
	 * @param checkZeroError
	 * @private whether the value can be zero
	 */
	private generateDetailRelPropValidation(detailProp: keyof IEstResourceEntity, checkZeroError?: boolean) {
		return async (info: ValidationInfo<IEstResourceEntity>) => {
			let validationResult = this.validateIsMandatory(info);
			if(checkZeroError && validationResult.valid){
				validationResult = this.divisionByZeroError(info);
			}
			if(validationResult.valid){
				this.estimateMainDetailCalculationService.calculateDetailRelProp(info.entity, info.value as number, detailProp);
				this.basicsSharedDataValidationService.applyValidationResult(this.dataService, { entity: info.entity, field: detailProp, result: new ValidationResult() });
				await this.calculateResource(info.entity);
			}
			return validationResult;
		};
	}

	/**
	 * EstResourceTypeShortKey validation function
	 * @param info
	 * @protected
	 */
	protected validateEstResourceTypeShortKey(info: ValidationInfo<IEstResourceEntity>): ValidationResult {
		const entity = info.entity;
		if (entity.EstResourceTypeFk === EstimateMainResourceType.SubItem || entity.EstResourceTypeFk === EstimateMainResourceType.TextLine || entity.EstResourceTypeFk === EstimateMainResourceType.InternalTextLine) {
			// sub item && I && T
			this.basicsSharedDataValidationService.applyValidationResult(this.dataService, { entity: info.entity, field: 'Code', result: new ValidationResult() });
			// if SubItem type is selected, reset EstAssemblyFk to null only in the assemblies module
			if (entity.EstResourceTypeFk === EstimateMainResourceType.SubItem) {
				entity.EstAssemblyFk = null;
			}
			//TODO-Walt: whether there are something wrong here
			// if (estimateMainResourceType) {
			// 	entity.EstResourceTypeFk = EstimateMainResourceType.EstResourceTypeFk;
			// }
		}

		//TODO-Walt: extract to special child class
		// if (entity.EstResourceTypeFk === EstimateMainResourceType.Plant && !plantAssembly && !isPrjPlantAssembly) { // plant
		// 	let processor = $injector.get('estimateMainResourceProcessor');
		// 	processor.readOnly([entity], true);                                                                       
		// 	processor.setColumnReadOnly(entity, model, false);
		// }
		// if (entity.EstResourceTypeFk === EstimateMainResourceType.Plant && isPrjPlantAssembly) { // plant
		// 	platformRuntimeDataService.readonly(entity, [{field:'Code', readonly:true}]);
		// }
              this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity,[{                      
				   field:'Code', readOnly: true                   
			  }]);
	
		return this.validateIsMandatory(info);
	}

	/**
	 * check whether value can be zero
	 * @param info
	 * @protected
	 */
	protected divisionByZeroError(info: ValidationInfo<IEstResourceEntity>) {
		let result = new ValidationResult();
		if (info.value === 0 || info.value === '0') {
			result = this.basicsSharedDataValidationService.createErrorObject('estimate.main.divisionByZero');
		}
		this.basicsSharedDataValidationService.applyValidationResult(this.dataService, {
			entity: info.entity,
			field: info.field,
			result: result,
		});
		return result;
	}

	/**
	 * WorkOperationTypeFk validation function
	 * @param info
	 * @protected
	 */
	protected async asyncValidateWorkOperationTypeFk(info: ValidationInfo<IEstResourceEntity>) {
		set(info.entity, info.field, info.value);
		info.entity.LgmJobFk = this.getAssemblyLgmJobId(info.entity);
		await this.calculateResource(info.entity);
		return new ValidationResult();
	}

	/**
	 * get the assembly jobFk
	 * @param entity
	 * @protected
	 */
	protected getAssemblyLgmJobId(entity: IEstResourceEntity){
		if(entity.LgmJobFk){
			return entity.LgmJobFk;
		}
		const parentEntity = this.assemblyDataService.getSelectedEntity();
		if(parentEntity && parentEntity.LgmJobFk){
			return parentEntity.LgmJobFk;
		}
		return null;
		//TODO-Walt: it seems that projectEntity have not LgmJobFk property
		// const projectSelected = this.projectMainDataService.getSelectedEntity();
		// return projectSelected && projectSelected.LgmJobFk ? projectSelected.LgmJobFk : null;
	}

	/**
	 * code validation function, it will check whether the subItem code is unique
	 * @param info
	 * @protected
	 */
	public validateCode(info: ValidationInfo<IEstResourceEntity>): ValidationResult {
		const resMandatory = this.validateIsMandatory(info);
		if (resMandatory.valid) {
			if (this.resourceTypeService.isSubItemEx(info.entity)) {
				// Validate unique code
				const subItemsExceptCurrent = this.dataService.flatList().filter((res) => this.resourceTypeService.isSubItemEx(res) && res.Id !== info.entity.Id);
				// Possible sub item with original code and new code used (Don't pick all subItems, it's unnecessary
				const subItemsWithCodeFound = subItemsExceptCurrent.filter((subItem) => subItem.Code === info.value || subItem.Code === info.entity.Code);
				if (subItemsWithCodeFound.length) {
					// Validate items with Original Code
					const subItemsWithOriginalCode = subItemsWithCodeFound.filter((subItem) => subItem.Code === info.entity.Code);
					if (subItemsWithOriginalCode.length === 1) {
						// If there is only one sub-item we clear the error, otherwise we keep the error
						this.basicsSharedDataValidationService.applyValidationResult(this.dataService, {
							entity: subItemsWithOriginalCode[0],
							field: info.field,
							result: new ValidationResult(),
						}); // Manual validation
					}
					// Validate items with New Code
					const subItemsWithNewCodeFound = subItemsWithCodeFound.filter((subItem) => subItem.Code === info.value);
					if (subItemsWithNewCodeFound.length) {
						return this.basicsSharedDataValidationService.createErrorObject({ key: 'cloud.common.uniqueValueErrorMessage', params: { object: 'Code' } }); // Default validation
					}
				}
			}
		} else {
			this.resourceCodeSettingService.resetPropInfo(info.entity);
			if (info.entity.EstResourceTypeFk === EstimateMainResourceType.Assembly && info.entity.EstAssemblyTypeFk) {
				if (info.entity.EstResources && info.entity.EstResources.length) {
					this.dataService.delete(info.entity.EstResources);
				}
			}
		}
		return resMandatory;
	}

	/**
	 * code validation function. it will get the info from lookup, and set the info value to resource, then calculate the resource.
	 * @param info
	 * @protected
	 */
	protected async asyncValidateCode(info: ValidationInfo<IEstResourceEntity>): Promise<ValidationResult> {
		switch (info.entity.EstResourceTypeFk) {
			case EstimateMainResourceType.CostCode: {
				return this.asyncValidateCodeByCostCode(info);
			}
			case EstimateMainResourceType.Material: {
				return this.asyncValidateCodeByMaterial(info);
			}
			case EstimateMainResourceType.Assembly:{
				return this.asyncValidateCodeByAssembly(info);
			}
			case EstimateMainResourceType.SubItem:{
				const subItems = this.validateSubItemsUniqueCode(info);
				return this.basicsSharedDataValidationService.isUniqueAndMandatory(info, subItems);
			}
			default:
				return Promise.resolve(new ValidationResult());
		}
	}

	/**
	 * description validation function
	 * @param info
	 * @protected
	 */
	protected async validateDescriptionInfo(info: ValidationInfo<IEstResourceEntity>) {
		switch (info.entity.EstResourceTypeFk) {
			case EstimateMainResourceType.CostCode: {
				return this.asyncValidateCodeByCostCode(info);
			}
			case EstimateMainResourceType.Material: {
				return this.asyncValidateCodeByMaterial(info);
			}
			case EstimateMainResourceType.Assembly:{
				return this.asyncValidateCodeByAssembly(info);
			}
			// Commented code to fix ALM 128700 Descriptions of Assembly Sub-Items need to be unique within certain Sub-Item levels
			// case EstimateMainResourceType.SubItem:{
			// 	const subItems = this.validateSubItemsUniqueCode(info);
			// 	return this.basicsSharedDataValidationService.isUniqueAndMandatory(info, subItems);
			// }
			default:
				return Promise.resolve(new ValidationResult());
		}
	}

	/**
	 * isDisabled validation function
	 * @param info
	 * @protected
	 */
	protected validateIsDisabled(info: ValidationInfo<IEstResourceEntity>) {
		const considerDisabledDirect = this.assemblyDataService.getConsiderDisabledDirect();
		info.entity.IsDisabledDirect = considerDisabledDirect ? info.value as boolean : false;
		this.traverseResource([info.entity], info.entity, info.value as boolean, info.entity.IsDisabledDirect);
		return new ValidationResult();
	}

	protected traverseResource(resources: IEstResourceEntity[], entity: IEstResourceEntity, disabled: boolean, considerDisabledDirect: boolean) {
		resources.forEach((resource) => {
			const isDisabled = considerDisabledDirect ? (resource.IsDisabledDirect && resource.Id !== entity.Id ? resource.IsDisabled : disabled) : disabled;
			resource.IsDisabled = isDisabled;
			this.dataService.setModified(resource);
			if (resource.EstResources && resource.EstResources.length) {
				this.traverseResource(resource.EstResources, entity, isDisabled, considerDisabledDirect);
			}
		});
	}

	/**
	 * validate the code depend on the costCode, please override it, when you are in project assembly or plant assembly.
	 * @param info
	 * @protected
	 */
	protected async asyncValidateCodeByCostCode(info: ValidationInfo<IEstResourceEntity>): Promise<ValidationResult> {
		const resource = info.entity;
		let costCodeSelected = this.resourceCodeSettingService.getSelectedCostCode();
		//if there are costCodeSelected and costCodeSelected.Code equal resource.Code, it means using lookup to select, else input text directly
		const isValidLookupItem: boolean = !!(costCodeSelected && costCodeSelected.Code === resource.Code);
		if (!isValidLookupItem || !costCodeSelected) {
			//if input code in text, get costCode in server-side
			const costCodeEntity = await lastValueFrom(this.getCostCodeByCode(resource.Code));
			if (!costCodeEntity) {
				return this.createNotFoundError();
			} else {
				this.resourceCodeSettingService.setSelectedCostCode(costCodeEntity);
				costCodeSelected = costCodeEntity;
			}
		}
		resource.HoursUnit = costCodeSelected.HourUnit ?? 0;
		this.resourceCodeSettingService.extractPropInfoFromCostCode(resource, costCodeSelected);
		await this.calculateResource(resource);
		return new ValidationResult();
	}

	/**
	 * validate the code depend on the material, if you are in project assembly or plant assembly, please override the extendMaterialSearchOptions method
	 * @param info
	 * @protected
	 */
	protected async asyncValidateCodeByMaterial(info: ValidationInfo<IEstResourceEntity>): Promise<ValidationResult> {
		const resource = info.entity;
		let materialSelected = this.resourceCodeSettingService.getMaterialSelected();
		//if there are materialSelected and materialSelected.Code equal resource.Code, it means using lookup to select, else input text directly
		const isValidLookupItem: boolean = !!(materialSelected && materialSelected.Code === resource.Code);
		if (!isValidLookupItem || !materialSelected) {
			const materialSearchResponse = await lastValueFrom(this.materialLookupService.search(this.createMaterialSearchOptions(resource)));
			const materialByCode = materialSearchResponse.items.find((e) => e.Code === resource.Code);
			if (materialByCode) {
				this.resourceCodeSettingService.setMaterialSelected(materialByCode);
				materialSelected = materialByCode;
			} else {
				return this.createNotFoundError();
			}
		}
		this.resourceCodeSettingService.extractPropInfoFromMaterial(resource, materialSelected);
		resource.MaterialPriceListFk = materialSelected.MaterialPriceListFk;
		await this.calculateResource(resource);
		return new ValidationResult();
	}

	/**
	 * validate the code depend on the assembly, if you are in project assembly or plant assembly, please override this method
	 * @param info
	 * @protected
	 */
	protected async asyncValidateCodeByAssembly(info: ValidationInfo<IEstResourceEntity>): Promise<ValidationResult> {
		const resource = info.entity;
		let assemblySelected = this.resourceCodeSettingService.getAssemblySelected();
		const parentEntity = this.assemblyDataService.getSelectedEntity();
		if(!parentEntity){
			return new ValidationResult();
		}
		//if there are assemblySelected and materialSelected.Code equal resource.Code, it means using lookup to select, else input text directly
		const isValidLookupItem: boolean = !!(assemblySelected && assemblySelected.Code === resource.Code);
		if (!isValidLookupItem || !assemblySelected) {
			assemblySelected = await lastValueFrom(this.getAssemblyByCode(resource.Code, this.getProjectId()));
			if (!assemblySelected) {
				return this.createNotFoundError();
			}
			//check self-reference
			if (assemblySelected.Id === parentEntity?.Id) {
				return this.createCircularReferenceError();
			}
			//check circular reference
			const circleDependencyAssemblies = await lastValueFrom(this.checkAssemblyCircularReference([assemblySelected.Id], parentEntity));
			if(circleDependencyAssemblies.includes(assemblySelected.Id)){
				return this.createCircularReferenceError();
			}
			this.resourceCodeSettingService.setAssemblySelected(assemblySelected);
		}
		//check assembly type
		const assemblyType = await lastValueFrom(this.getAssemblyTypeByAssemblyId(assemblySelected.Id));
		if (resource.EstAssemblyTypeFk && assemblyType && resource.EstAssemblyTypeFk !== assemblyType.Id) {
			return this.createNotFoundError();
		}
		// Assign current company currency to lookup which will be assigned to assembly
		//TODO-Walt
		//resource.CurrencyFk = estimateAssembliesService.getCompanyCurrency();
		this.resourceCodeSettingService.extractPropInfoFromAssembly(resource, assemblySelected, true);
		if (assemblyType) {
			resource.IsBudget = assemblyType.IsBudget;
			resource.IsCost = assemblyType.IsCost;
		}
		if (!assemblySelected.MdcCostCodeFk && !assemblySelected.MdcMaterialFk) {
			resource.EstAssemblyTypeFk = null;
		}
		if(this.resourceTypeService.isCAorMAorCUorMUAssembly(assemblyType, assemblySelected)){
			//TODO-Walt: <estimateMainCommonService>.getResourceTypeByAssemblyType
			// const resourceType = await estimateMainCommonService.getResourceTypeByAssemblyType(assemblyType);
			// if(resourceType){
			// 	resource.EstResourceTypeFk = EstimateMainResourceType.Assembly;
			// 	resource.EstResourceTypeFkExtend = resourceType.Id;
			// 	resource.EstAssemblyTypeFk = resourceType.EstAssemblyTypeFk;
			// }
		}else{
			resource.EstAssemblyTypeFk = null;
			resource.EstResourceTypeFkExtend = resource.EstResourceTypeFk;
		}
		await this.calculateResource(resource);
		return new ValidationResult();
	}

	protected createNotFoundError() {
		const errorObject = this.basicsSharedDataValidationService.createErrorObject('estimate.main.errors.codeNotFound');
		errorObject.valid = false;
		return errorObject;
	}

	protected createCircularReferenceError(){
		const errorObject = this.basicsSharedDataValidationService.createErrorObject('estimate.main.errors.circularReference');
		errorObject.valid = false;
		return errorObject;
	}

	protected async calculateResource(currentResource: IEstResourceEntity) {
		await Promise.all([
			this.estimateMainExchangeRateService.loadData(this.getProjectId() ?? 0),
			this.assemblyCalculationService.loadCompositeAssemblyResources(this.dataService.flatList())
		]);

		currentResource.ExchangeRate = currentResource.BasCurrencyFk ? this.estimateMainExchangeRateService.getExchRate(currentResource.BasCurrencyFk) : 1;
		//calculate
		const parentEntity = this.assemblyDataService.getSelectedEntity();
		if (parentEntity) {
			const resourcesChanges = this.assemblyCalculationService.calculateResource(currentResource, parentEntity, this.dataService.flatList());
			this.dataService.setModified(resourcesChanges);
			this.assemblyDataService.setModified(parentEntity);
			//TODO-Walt: grid refresh
		}
		//TODO-Walt: calculate UDP
		//TODO-Walt: assign characteristic
	}

	/**
	 * check whether the subItem code is unique
	 * @param info
	 * @protected
	 */
	protected validateSubItemsUniqueCode(info: ValidationInfo<IEstResourceEntity>) {
		const subItems: IEstResourceEntity[] = [];
		const subItemsWithError: IEstResourceEntity[] = [];
		const subItemsWithoutError: IEstResourceEntity[] = [];
		const resourceList = this.dataService.flatList();
		resourceList.forEach((item) => {
			if (item.EstResourceTypeFk === 5 && item.EstAssemblyFk === null && item.Id !== info.entity.Id) {
				const validationErrors = this.dataService.getValidationErrors(item).filter((e) => e.field === info.field);
				if (validationErrors && validationErrors.length) {
					subItemsWithError.push(item);
				} else if (item.Code === info.value) {
					subItemsWithoutError.push(item);
				}
				subItems.push(item);
			}
		});

		subItemsWithoutError.forEach((subItem) => {
			this.validateSubItemUniqueCode(info, subItemsWithoutError, subItem);
		});
		subItemsWithError.forEach((subItem) => {
			this.validateSubItemUniqueCode(info, subItems, subItem);
		});

		return subItems;
	}

	private validateSubItemUniqueCode(info: ValidationInfo<IEstResourceEntity>, itemList: IEstResourceEntity[], subItem: IEstResourceEntity) {
		const newInfo = new ValidationInfo(info.entity, subItem.Code, info.field);
		const validationResult = this.basicsSharedDataValidationService.isValueUnique(newInfo, itemList);
		this.basicsSharedDataValidationService.applyValidationResult(this.dataService, {
			entity: subItem,
			field: info.field,
			result: validationResult
		});
	}

	private checkAssemblyCircularReference(ids: number[], assembly: IEstLineItemEntity): Observable<number[]>{
		return this.http.post<number[]>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/resource/filterassignedassemblies_new', {
			assemblyId: assembly.Id,
			ids: ids,
			estAssemblyHeaderFk: assembly.EstHeaderAssemblyFk,
			estAssemblyFk: assembly.EstAssemblyFk
		});
	}

	protected getCharacteristic(entity: IEstResourceEntity) {
		entity.CharacteristicSectionId = 45;
		entity.BasUomFk = entity.BasUomFk ? entity.BasUomFk : 0;
		return this.http.post(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/lineitem/getCharacteristicResourceTypeByCCMaterialId', entity);
	}

	protected getAssemblyByCode(assemblyCode: string, projectId?: number | null): Observable<IEstLineItemEntity | null> {
		let url = this.platformConfigurationService.webApiBaseUrl + 'estimate/assemblies/getitembycode?code=' + assemblyCode.toUpperCase();
		if (projectId) {
			url += '&projectId=' + projectId;
		}
		return this.http.get<IEstLineItemEntity | null>(url);
	}

	protected getProjectId(): number | null {
		return null;
	}

	protected getAssemblyTypeByAssemblyId(assemblyId: number) {
		return this.http.get<IEstAssemblyTypeEntity | null>(this.platformConfigurationService.webApiBaseUrl + 'estimate/assemblies/assemblytype/assemblytypebyassemblyid?assemblyId=' + assemblyId);
	}

	protected getCostCodeByCode(code: string) {
		return this.http.get<ICostCodeEntity | null>(this.platformConfigurationService.webApiBaseUrl + 'basics/costcodes/getcostcodebycode?code=' + code);
	}

	/**
	 * create the material search options, if you need to provider the projectId, please override this method
	 * @param resource
	 * @protected
	 */
	protected createMaterialSearchOptions(resource: IEstResourceEntity): MaterialSearchRequest {
		const searchOptions = new MaterialSearchRequest();
		// Material search configuration
		searchOptions.isMaster = true;
		searchOptions.CategoryIdsFilter = [];
		searchOptions.MaterialTypeFilter.IsForEstimate = true;
		const assemblyCategory = this.assemblyDataService.getAssemblyCategory();
		if (assemblyCategory && (assemblyCategory.EstAssemblyTypeLogicFk === AssemblyType.CrewAssembly || assemblyCategory.EstAssemblyTypeLogicFk === AssemblyType.CrewAssemblyUpdated)) {
			searchOptions.IsLabour = true;
		}
		searchOptions.SearchText = resource.Code;
		return searchOptions;
	}
}