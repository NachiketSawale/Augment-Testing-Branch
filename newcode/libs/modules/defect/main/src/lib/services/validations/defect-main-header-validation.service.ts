/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedDataValidationService, BasicsSharedNumberGenerationService, Rubric } from '@libs/basics/shared';
import { ProcurementShareContractLookupService, ProcurementSharePesLookupService } from '@libs/procurement/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { firstValueFrom } from 'rxjs';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';
import { DefectMainHeaderDataService } from '../defect-main-header-data.service';

/**
 * Defect validation service
 */
@Injectable({
	providedIn: 'root',
})
export class DefectMainHeaderValidationService extends BaseValidationService<IDfmDefectEntity> {
	private readonly dataService = inject(DefectMainHeaderDataService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly http = inject(PlatformHttpService);
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly checkUniqueUrl: string = 'defect/main/header/isunique';

	private readonly contractLookupService = inject(ProcurementShareContractLookupService);
	private readonly projectLookupService = inject(ProjectSharedLookupService);
	private readonly bpValidator = ServiceLocator.injector.get(BusinessPartnerLogicalValidatorFactoryService).create({
		businessPartnerField: 'BpdBusinesspartnerFk',
		subsidiaryField: 'BpdSubsidiaryFk',
		contactField: 'BpdContactFk',
		dataService: this.dataService,
	});

	protected generateValidationFunctions(): IValidationFunctions<IDfmDefectEntity> {
		return {
			Code: this.asyncValidateCode,
			ConHeaderFk: this.validateConHeaderFk,
			OrdHeaderFk: this.validateOrdHeaderFk,
			PrjProjectFk: [this.validatePrjProjectFk, this.asyncValidatePrjProjectFk],
			PsdScheduleFk: this.validatePsdScheduleFk,
			DateIssued: this.validateDateIssued,
			Isexternal: this.validateIsexternal,
			RubricCategoryFk: this.asyncValidateRubricCategoryFk,
			DfmStatusFk: this.validateDfmStatusFk,
			BasDefectTypeFk: this.validateBasDefectTypeFk,
			BasDefectPriorityFk: this.validateBasDefectPriorityFk,
			BasDefectSeverityFk: this.validateBasDefectSeverityFk,
			DfmRaisedbyFk: this.validateDfmRaisedbyFk,
			BpdBusinesspartnerFk: this.validateBusinessPartnerFk,
			BpdSubsidiaryFk: this.validateSubsidiaryFk,
			ObjectSetKey: this.validateObjectSetKey,
			HsqChecklistFk: this.validateHsqChecklistFk,
			pesHeaderFk: this.validatePesHeaderFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IDfmDefectEntity> {
		return this.dataService;
	}
	protected validateBusinessPartnerFk = async (info: ValidationInfo<IDfmDefectEntity>) =>
		this.bpValidator.businessPartnerValidator({
			entity: info.entity,
			value: info.value as number,
		});
	protected validateSubsidiaryFk = async (info: ValidationInfo<IDfmDefectEntity>) => this.bpValidator.subsidiaryValidator(info.entity, info.value as number);

	private asyncValidateCode(info: ValidationInfo<IDfmDefectEntity>): Promise<ValidationResult> {
		return new Promise((resolve) => {
			const entity = info.entity;
			const value = info.value as string;
			let result = this.validateIsMandatory(info);
			if (!result.valid) {
				resolve(result);
			} else {
				result = this.validateIsUnique(info);
				if (!result.valid) {
					resolve(result);
				} else {
					entity.Code = value;
					this.http
						.get<boolean>(this.checkUniqueUrl, {
							params: {
								id: entity.Id,
								projectfk: entity.PrjProjectFk,
								code: value,
							},
						})
						.then((response) => {
							const isUnique = response as boolean;
							if (isUnique) {
								resolve({ apply: true, valid: true });
							} else {
								resolve({
									apply: false,
									valid: false,
									error: this.translateService.instant('defect.main.uniqueValueErrorMessage').text,
								});
							}
						});
				}
			}
		});
	}
	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IDfmDefectEntity>): IDfmDefectEntity[] => {
		const itemList = this.dataService.getList();
		return itemList.filter((item) => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});
	};

	private validateIsexternal(info: ValidationInfo<IDfmDefectEntity>): ValidationResult {
		if (!info.value) {
			// External defect is not checked, the BP should be cleared,#94115
			info.entity.BpdBusinesspartnerFk = null;
			info.entity.BpdSubsidiaryFk = null;
			info.entity.BpdContactFk = null;
			this.dataService.readonlyProcessor.process(info.entity);
		}

		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateRubricCategoryFk(info: ValidationInfo<IDfmDefectEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		const oldRubricCategoryFk = info.entity.RubricCategoryFk;

		if (entity.RubricCategoryFk !== value) {
			this.http
				.get<number>('defect/main/header/getdefaultstatusbycategory', {
					params: {
						categoryId: value,
					},
				})
				.then((response) => {
					if (response && response !== 0) {
						info.entity.DfmStatusFk = response;
						this.dataService.setModified(info.entity);
					} else {
						this.messageBoxService.showMsgBox(this.translateService.instant('defect.main.rubricCategoryMissingDefautStatus').text, this.translateService.instant('defect.main.NoDefaultStatus').text, 'ico-warning');
						// if error, then set back to original rubricCategory
						info.entity.RubricCategoryFk = oldRubricCategoryFk;
					}
				});
		}

		if (!info.entity.Code || info.entity.Version === 0) {
			const hasToGenerateCode = info.value ? this.genNumberSvc.hasNumberGenerateConfig(value) : false;
			if (hasToGenerateCode && info.value) {
				info.entity.Code = this.genNumberSvc.provideNumberDefaultText(value, Rubric.DefectManagement);
			}
		}

		this.http
			.get<number>('defect/main/header/getdefaultdefecttype', {
				params: {
					rubricCategoryId: value,
				},
			})
			.then(function (response) {
				info.entity.BasDefectTypeFk = response;
			});

		return this.validationUtils.createSuccessObject();
	}

	private async validateConHeaderFk(info: ValidationInfo<IDfmDefectEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;

		if (value) {
			entity.OrdHeaderFk = null;
			const contract = await firstValueFrom(this.contractLookupService.getItemByKey({ id: value }));
			if (contract) {
				if (contract.ProjectFk) {
					entity.PrjProjectFk = contract.ProjectFk;
				}
				entity.ConHeaderFk = value;
				entity.MdcControllingunitFk = contract.ControllingUnitFk;
				entity.BpdBusinesspartnerFk = contract.BusinessPartnerFk;
				entity.MdcControllingunitFk = contract.ControllingUnitFk;
				entity.Isexternal = true;
				// todo：get PrcHeaderEntity
				// info.entity.PrcStructureFk = contract.PrcHeaderEntity.StructureFk;
				// info.entity.BpdSubsidiaryFk = contract.SubsidiaryFk;
				// info.entity.BpdContactFk = contract.ContactFk;
			}
			this.dataService.readonlyProcessor.process(info.entity);
		}

		return this.validationUtils.createSuccessObject();
	}

	private validatePsdScheduleFk(info: ValidationInfo<IDfmDefectEntity>): ValidationResult {
		info.entity.PsdActivityFk = null;
		return this.validationUtils.createSuccessObject();
	}

	private validateDateIssued(info: ValidationInfo<IDfmDefectEntity>): ValidationResult {
		const fieldName = this.translateService.instant('defect.main.entityDateIssued').text;
		return this.validateMandatory(info, fieldName);
	}

	private async validatePrjProjectFk(info: ValidationInfo<IDfmDefectEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : 0;
		let result = this.validateIsMandatory(info);

		const fieldName = this.translateService.instant('defect.main.entityPrjProjectFk').text;

		if (!result.valid) {
			result = this.createMandatoryErrorObject(fieldName);
		} else {
			const project = await firstValueFrom(this.projectLookupService.getItemByKey({ id: value }));
			if (project) {
				entity.BasCurrencyFk = project.CurrencyFk;
			}
		}
		if (!!entity.PrjProjectFk && !value) {
			entity.ConHeaderFk = null;
			entity.OrdHeaderFk = null;
			this.validateConHeaderFk(new ValidationInfo(entity, entity.ConHeaderFk ?? undefined, 'ConHeaderFk')).then();
			this.validateOrdHeaderFk(new ValidationInfo(entity, entity.OrdHeaderFk ?? undefined, 'OrdHeaderFk'));
		}

		entity.DfmDefectFk = null;
		if (entity.PrjProjectFk !== value) {
			entity.PsdScheduleFk = null;
			entity.MdcControllingunitFk = null;
		}

		this.dataService.readonlyProcessor.process(info.entity);
		return result;
	}

	private asyncValidatePrjProjectFk(info: ValidationInfo<IDfmDefectEntity>) {
		const entity = info.entity;
		if (entity.Code) {
			return this.asyncValidateCode(new ValidationInfo(entity, entity.Code, 'Code'));
		} else {
			return this.validationUtils.createSuccessObject();
		}
	}
	private validateOrdHeaderFk(info: ValidationInfo<IDfmDefectEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : 0;
		if (!value) {
			this.dataService.setEntityReadOnlyFields(entity, [
				{
					readOnly: false,
					field: 'ConHeaderFk',
				},
			]);
			entity.PrcStructureFk = null;
			//defectMainHeaderDataService.gridRefresh();
		} else {
			this.dataService.setEntityReadOnlyFields(entity, [
				{
					readOnly: true,
					field: 'ConHeaderFk',
				},
			]);
			/// todo waiting for SalesContract lookup service
			// basicsLookupdataLookupDataService.getItemByKey('SalesContract', value).then(function (contract) {
			// 	entity.PrjProjectFk = contract.ProjectFk;
			// 	// setNotReadonlyFromProjectFk(entity);
			// 	validatePrjProjectFk(entity,entity.PrjProjectFk,'PrjProjectFk');
			// 	if(!_.isNil(entity.BpdBusinesspartnerFk)){
			// 		setNotReadonlyFromBpdBusinesspartnerFk(entity);
			// 	}
			// 	service.validatePrjProjectFk(entity,contract.ProjectFk,'PrjProjectFk');
			// 	defectMainHeaderDataService.gridRefresh();
			// });
		}

		return new ValidationResult();
	}

	/**
	 * validate generated code
	 * @param generatedCode
	 */
	public validateGeneratedCode(generatedCode: string | null) {
		if (this.validationUtils.isEmptyProp(generatedCode)) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.generatenNumberFailed',
				params: { fieldName: 'Code' },
			});
		}
		return new ValidationResult();
	}

	private validateDfmStatusFk(info: ValidationInfo<IDfmDefectEntity>): ValidationResult {
		const fieldName = this.translateService.instant('cloud.common.entityStatus').text;
		return this.validateMandatory(info, fieldName);
	}

	private validateBasDefectTypeFk(info: ValidationInfo<IDfmDefectEntity>): ValidationResult {
		const fieldName = this.translateService.instant('cloud.common.entityBasDefectTypeFk').text;
		return this.validateMandatory(info, fieldName);
	}

	private validateBasDefectPriorityFk(info: ValidationInfo<IDfmDefectEntity>) {
		const fieldName = this.translateService.instant('defect.main.entityBasDefectPriorityFk').text;
		return this.validateMandatory(info, fieldName);
	}

	private validateBasDefectSeverityFk(info: ValidationInfo<IDfmDefectEntity>) {
		const fieldName = this.translateService.instant('defect.main.entityBasDefectSeverityFk').text;
		return this.validateMandatory(info, fieldName);
	}

	private validateDfmRaisedbyFk(info: ValidationInfo<IDfmDefectEntity>) {
		const fieldName = this.translateService.instant('defect.main.entityDfmRaisedbyFk').text;
		return this.validateMandatory(info, fieldName);
	}
	/**
	 *  common mandatory validate with customized fieldName
	 * @param fieldName
	 * @private
	 */
	private validateMandatory(info: ValidationInfo<IDfmDefectEntity>, fieldName: string): ValidationResult {
		const result = this.validateIsMandatory(info);
		if (!result.valid) {
			return this.createMandatoryErrorObject(fieldName);
		}
		return this.validationUtils.createSuccessObject();
	}

	private createMandatoryErrorObject(fieldName: string) {
		return this.validationUtils.createErrorObject({
			key: 'cloud.common.emptyOrNullValueErrorMessage',
			params: { fieldName: fieldName },
		});
	}

	private validateObjectSetKey(info: ValidationInfo<IDfmDefectEntity>) {
		const value = info.value ? (info.value as string) : null;
		if (value) {
			info.entity.MdlObjectsetFk = value.split('_')[1] as unknown as number;
		} else {
			info.entity.MdlObjectsetFk = null;
		}
		return this.validationUtils.createSuccessObject();
	}

	private validatePesHeaderFk(info: ValidationInfo<IDfmDefectEntity>) {
		const value = info.value ? (info.value as number) : null;
		const entity = info.entity;
		if (value) {
			const procurementSharePesLookupService = ServiceLocator.injector.get(ProcurementSharePesLookupService);
			procurementSharePesLookupService.getItemByKey({ id: value }).subscribe((pesEntity) => {
				if (pesEntity && (pesEntity.ConHeaderFk || pesEntity.ConHeaderFk === 0)) {
					entity.ConHeaderFk = pesEntity.ConHeaderFk;
				}
				this.validateConHeaderFk(new ValidationInfo(entity, info.entity.ConHeaderFk ?? undefined, 'ConHeaderFk')).then();
			});
		}
		return this.validationUtils.createSuccessObject();
	}
	private validateHsqChecklistFk(info: ValidationInfo<IDfmDefectEntity>) {
		/// todo waiting for checklist form data service ready
		// entity.HsqChecklistFk = value;
		// var checkListFormDataService = $injector.get('defectCheckListFormDataService');
		// if(checkListFormDataService){
		// 	checkListFormDataService.load();
		// }
		return this.validationUtils.createSuccessObject();
	}
}
