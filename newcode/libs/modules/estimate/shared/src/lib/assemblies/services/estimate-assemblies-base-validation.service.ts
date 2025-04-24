/*
 * Copyright(c) RIB Software GmbH
 */

import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { EstimateMainDetailCalculationService } from '../../common/services/estimate-main-detail-calculation.service';
import { AssemblyCalculationService } from './../../calculation/services/assembly-calculation.service';
import { IEditableDataService } from '@libs/procurement/shared';
import { IAssemblyDataService } from '../model/assembly-data-service.interface';
import { set } from 'lodash';
import {
	BasicsSharedCostCodeLookupService, BasicsSharedDataValidationService,
	BasicsSharedMaterialLookupService,
	BasicsSharedUomLookupService
} from '@libs/basics/shared';
import { IBasicsUomEntity } from '@libs/basics/interfaces';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';

/**
 * assemblies entity base validation
 */
export class EstimateAssembliesBaseValidationService extends BaseValidationService<IEstLineItemEntity>{

	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly estimateMainDetailCalculationService = inject(EstimateMainDetailCalculationService);
	private readonly assemblyCalculationService = inject(AssemblyCalculationService);
	private readonly basicsSharedUomLookupService = inject(BasicsSharedUomLookupService);
	private readonly basicsSharedCostCodeLookupService = inject(BasicsSharedCostCodeLookupService);
	private readonly basicsSharedMaterialLookupService = inject(BasicsSharedMaterialLookupService);
	protected readonly basicsSharedDataValidationService = inject(BasicsSharedDataValidationService);

	/**
	 * constructor
	 * @param dataService assemblyDataService
	 * @protected
	 */
	public constructor(protected dataService:IEditableDataService<IEstLineItemEntity> & IEntityRuntimeDataRegistry<IEstLineItemEntity> & IAssemblyDataService) {
		super();
	}

	/**
	 * generateValidationFunctions
	 * @protected
	 */
	protected generateValidationFunctions(): IValidationFunctions<IEstLineItemEntity> {
		return {
			Code: [this.validateCode, this.asyncValidateCode],
			EstAssemblyCatFk: [this.asyncValidateEstAssemblyCatFk],
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
			ProductivityFactor: [this.detailRelPropValidation('ProductivityFactorDetail')],
			ProductivityFactorDetail: [this.detailPropValidate('ProductivityFactor')],
			CostFactor1: [this.detailRelPropValidation('CostFactorDetail1')],
			CostFactorDetail1: [this.detailPropValidate('CostFactor1')],
			CostFactor2: [this.detailRelPropValidation('CostFactorDetail2')],
			CostFactorDetail2: [this.detailPropValidate('CostFactor2')],
			IsGc: [this.asyncValidateIsGc],
			IsDisabled: [this.asyncValidateIsDisabled],
			MdcCostCodeFk: [this.asyncValidateMdcCostCodeFk],
			MdcMaterialFk: [this.asyncValidateMdcMaterialFk],
			BasUomFk: [this.asyncValidateBasUomFk]
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstLineItemEntity> {
		return this.dataService;
	}

	public validateCode(info: ValidationInfo<IEstLineItemEntity>): ValidationResult{
		if (!info.value) {
			return this.validateIsMandatory(info);
		}

		// if you can find same code in the page data, return false validation
		const assemblies = this.dataService.getList();
		if(assemblies.some(e => e.EstAssemblyCatFk === info.entity.EstAssemblyCatFk && e.Code === info.value)){
			return new ValidationResult(this.translateService.instant('cloud.common.entityCode').text);
		}

		return this.validateIsMandatory(info);
	}

	public asyncValidateCode(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult>{
		const postData = {
			Id: info.entity.Id,
			estHeaderFk: info.entity.EstHeaderFk,
			Code: info.value,
			EstAssemblyCatFk: info.entity.EstAssemblyCatFk
		};
		return new Promise<ValidationResult>(resolve => {
			this.http.post(this.configurationService.webApiBaseUrl + 'estimate/assemblies/isuniquecode', postData).subscribe((response) => {
				if (response) {
					resolve(new ValidationResult());
				} else {
					resolve(new ValidationResult(this.translateService.instant('estimate.assemblies.errors.uniqCode').text));
				}
			});
		});
	}

	public asyncValidateEstAssemblyCatFk(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult>{
		const postData = {
			Id: info.value,
			IdBefore: info.entity.EstAssemblyCatFk,
			HasAssemblyResources: true //TODO-Walt: !_.isEmpty(estimateAssembliesResourceService.getList())
		};
		return new Promise<ValidationResult>(resolve => {
			this.http.post(this.configurationService.webApiBaseUrl + 'estimate/assemblies/isvalidassemblycat', postData).subscribe((isValid) => {
				const validationResult = new ValidationResult(this.translateService.instant('estimate.assemblies.errors.assemblyTypeError').text);
				validationResult.valid = isValid as boolean;
				// If category is valid, next we validate unique code
				if (validationResult.valid) {
					// Validate Assembly 'Code' unique code
					const postCodeData = {
						Id: info.entity.Id,
						estHeaderFk: info.entity.EstHeaderFk,
						Code: info.entity.Code,
						EstAssemblyCatFk: info.value
					};
					this.http.post(this.configurationService.webApiBaseUrl + 'estimate/assemblies/isuniquecode', postCodeData).subscribe((response) => {
						const uniqCodeValidationRes = new ValidationResult(this.translateService.instant('estimate.assemblies.errors.uniqCode').text);
						uniqCodeValidationRes.valid = response as boolean;
						resolve(uniqCodeValidationRes);
					});
				}
				resolve(validationResult);
			});
		});
	}

	public asyncValidateIsGc(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult>{
		const assemblyResourceDataService = this.dataService.getAssemblyResourceDataService();
		if(assemblyResourceDataService){
			const assemblyResources = assemblyResourceDataService.flatList();
			if(assemblyResources && assemblyResources.length){
				assemblyResourceDataService.setIndirectCost(assemblyResources, info.value as boolean);
				assemblyResources.forEach(e =>{
					assemblyResourceDataService.setModified(assemblyResources);
				});
			}
		}
		return this.valueChangeValidation(info);
	}

	public asyncValidateIsDisabled(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult>{
		return this.valueChangeValidation(info);
	}

	public asyncValidateMdcCostCodeFk(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		if (info.value && info.entity.BasUomFk) {
			return new Promise<ValidationResult>(resolve => {
				this.basicsSharedCostCodeLookupService.getItemByKey({ id : info.value as number }).subscribe(costCodeEntity => {
					this.checkBasicUomAndLookupUomDimension(info.entity.BasUomFk ?? 0, costCodeEntity.UomFk ?? 0).then(validationResult =>{
						resolve(validationResult);
					});
				});
			});
		}
		return Promise.resolve(new ValidationResult());
	}

	public asyncValidateMdcMaterialFk(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		if (info.value && info.entity.BasUomFk) {
			return new Promise<ValidationResult>(resolve => {
				this.basicsSharedMaterialLookupService.getItemByKey({ id : info.value as number }).subscribe(materialEntity => {
					this.checkBasicUomAndLookupUomDimension(info.entity.BasUomFk ?? 0, materialEntity.BasUomFk).then(validationResult =>{
						resolve(validationResult);
					});
				});
			});
		}
		return Promise.resolve(new ValidationResult());
	}

	public asyncValidateBasUomFk(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		if(info.value){
			if (info.entity.MdcCostCodeFk) {
				return new Promise<ValidationResult>(resolve => {
					this.basicsSharedCostCodeLookupService.getItemByKey({ id : info.entity.MdcCostCodeFk as number }).subscribe(costCodeEntity => {
						this.checkBasicUomAndLookupUomDimension(info.value as number, costCodeEntity.UomFk ?? 0).then(validationResult =>{
							resolve(validationResult);
						});
					});
				});
			}else if(info.entity.MdcMaterialFk){
				return new Promise<ValidationResult>(resolve => {
					this.basicsSharedMaterialLookupService.getItemByKey({ id : info.entity.MdcMaterialFk as number }).subscribe(materialEntity => {
						this.checkBasicUomAndLookupUomDimension(info.value as number, materialEntity.BasUomFk).then(validationResult =>{
							resolve(validationResult);
						});
					});
				});
			}
		}
		return Promise.resolve(new ValidationResult());
	}

	private checkBasicUomAndLookupUomDimension(basUomFk : number, lookupUomFk: number): Promise<ValidationResult>{
		return new Promise<ValidationResult>(resolve => {
			this.basicsSharedUomLookupService.getList().subscribe(uoms =>{
				const basUomEntity = uoms.find(e => e.Id === basUomFk);
				const lookupUomEntity = uoms.find(e => e.Id === lookupUomFk);
				if(basUomEntity && lookupUomEntity){
					if (basUomEntity.LengthDimension === lookupUomEntity.LengthDimension &&
						basUomEntity.TimeDimension === lookupUomEntity.TimeDimension &&
						basUomEntity.MassDimension === lookupUomEntity.MassDimension) {
						// Valid uom/able to convert
						resolve(new ValidationResult());
					} else {
						// showWarningPrompt('Cannot convert Assembly\'s UoM ' + uomAssembly.Unit + ' to ' + uomLookupItem.Unit);
						this.showWarningPrompt(basUomEntity, lookupUomEntity).then(warningInfo =>{
							resolve(warningInfo);
						});
					}
				}
				resolve(new ValidationResult());
			});
		});
	}

	private showWarningPrompt(basicUomEntity: IBasicsUomEntity, lookupUomEntity: IBasicsUomEntity): Promise<ValidationResult> {
		const modalOptions = {
			headerTextKey: 'estimate.assemblies.assembly',
			bodyTextKey: this.translateService.instant({ key : 'estimate.assemblies.dialog.WarningAssemblyUomAssignConversion', params: { assemblyUoM : basicUomEntity.UnitInfo?.Description, lookupItemUoM : lookupUomEntity.UnitInfo?.Description}}).text,
			showOkButton: true,
			iconClass: 'ico-warning'
		};
		return new Promise<ValidationResult>(resolve => {
			this.messageBoxService.showMsgBox(modalOptions)?.then((dialogResult) =>{
				resolve(new ValidationResult());
			});
		});
	}

	private detailPropValidate(detailRelProp: keyof IEstLineItemEntity) {
		return (info: ValidationInfo<IEstLineItemEntity>) => {
			this.estimateMainDetailCalculationService.calculateDetailProp(info.entity, info.value as string, detailRelProp);
			this.basicsSharedDataValidationService.applyValidationResult(this.dataService, { entity: info.entity, field: detailRelProp, result: new ValidationResult() });
			return this.valueChangeValidation(info);
		};
	}

	private detailRelPropValidation(detailProp: keyof IEstLineItemEntity) {
		return (info: ValidationInfo<IEstLineItemEntity>) => {
			this.estimateMainDetailCalculationService.calculateDetailRelProp(info.entity, info.value as number, detailProp);
			this.basicsSharedDataValidationService.applyValidationResult(this.dataService, { entity: info.entity, field: detailProp, result: new ValidationResult() });
			return this.valueChangeValidation(info);
		};
	}

	private valueChangeValidation(info: ValidationInfo<IEstLineItemEntity>): Promise<ValidationResult> {
		if(info.field in info.entity){
			set(info.entity, info.field, info.value);
		}
		const assemblyResourceDataService = this.dataService.getAssemblyResourceDataService();
		if(assemblyResourceDataService){
			const assemblyResources = assemblyResourceDataService.flatList();
			if(assemblyResources && assemblyResources.length){
				return new Promise<ValidationResult>(resolve => {
					this.assemblyCalculationService.loadCompositeAssemblyResources(assemblyResources).then(() => {
						this.assemblyCalculationService.calculateLineItemAndResources(info.entity, assemblyResourceDataService.getList());
						assemblyResourceDataService.setModified(assemblyResources);
						resolve(new ValidationResult());
					});
				});
			}
		}
		return Promise.resolve(new ValidationResult());
	}
}