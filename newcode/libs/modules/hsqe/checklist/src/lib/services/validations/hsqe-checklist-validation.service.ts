import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';
import { HsqeChecklistDataService } from '../hsqe-checklist-data.service';
import { IHsqCheckListEntity } from '@libs/hsqe/interfaces';

import { BasicsSharedDataValidationService, BasicsSharedNumberGenerationService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistValidationService extends BaseValidationService<IHsqCheckListEntity> {
	private readonly dataService: HsqeChecklistDataService = inject(HsqeChecklistDataService);
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);

	private readonly bpValidator = inject(BusinessPartnerLogicalValidatorFactoryService).create({
		dataService: this.dataService, // Required. Determine the data service relates to the validation service
		businessPartnerField: 'BpdBusinesspartnerFk',
		subsidiaryField: 'BpdSubsidiaryFk',
		contactField: 'BpdContactFk',
	});
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IHsqCheckListEntity> {
		return {
			BpdBusinesspartnerFk: this.validateBusinessPartnerFk,
			BpdSubsidiaryFk: this.validateSubsidiaryFk,
			Code: this.validateCode,
		};
	}

	protected validateBusinessPartnerFk = async (info: ValidationInfo<IHsqCheckListEntity>) =>
		this.bpValidator.businessPartnerValidator({
			entity: info.entity,
			value: info.value as number,
		});
	protected validateSubsidiaryFk = async (info: ValidationInfo<IHsqCheckListEntity>) => this.bpValidator.subsidiaryValidator(info.entity, info.value as number);

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IHsqCheckListEntity> {
		return this.dataService;
	}

	protected validateCode(info: ValidationInfo<IHsqCheckListEntity>) {
		const entity = info.entity;
		const checklistTypeEntity = this.dataService.getChecklistTypeEntity(entity);
		if (checklistTypeEntity && entity.Version === 0) {
			const rubricCategoryFk = checklistTypeEntity.RubricCategoryFk;
			const hasToGenerateCode = this.genNumberSvc.hasNumberGenerateConfig(checklistTypeEntity.RubricCategoryFk);
			if (hasToGenerateCode) {
				entity.Code = this.genNumberSvc.provideNumberDefaultText(rubricCategoryFk);
				return this.validationUtils.createSuccessObject();
			}
		}
		return this.validateIsMandatory(info);
	}

	/**
	 * validate generated code
	 * @param generatedCode
	 */
	public validateGenaratedCode(generatedCode: string | null) {
		if (this.validationUtils.isEmptyProp(generatedCode)) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.generatenNumberFailed',
				params: { fieldName: 'Code' },
			});
		}
		return this.validationUtils.createSuccessObject();
	}

	private validationFk(value: unknown) {
		return value === undefined || value === null || value === '' || value === -1 || value === 0;
	}

	public validateHsqCheckListTemplateFk(checklistEntity: IHsqCheckListEntity, value: number | null | undefined) {
		if ((!this.validationFk(value) && checklistEntity.HsqCheckListTemplateFk !== value) || checklistEntity.Version === 0) {
			/// TODO WAITING FOR hsqeCheckListFormDataService READY
			// if (formDataService) {
			// 	if (entity.Version === -1) {
			// 		// bug in CreationInitialDialog, it will doUpdate when setList
			// 		return;
			// 	}
			// 	$http.get(globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/gettemplate?mainId=' + value).then(function (result) {
			// 		if (_.isObject(result) && _.isObject(result.data)) {
			// 			var dto = result.data;
			// 			entity.CheckListGroupFk = dto.HsqCheckListGroupFk;
			// 			entity.HsqChkListTypeFk = dto.HsqCheckListTypeFk;
			// 			entity.PrcStructureFk = dto.PrcStructureFk;
			// 			entity.BasRubricCategoryFk = dto.BasRubricCategoryFk;
			// 			entity.DescriptionInfo = dto.DescriptionInfo;
			// 			if (dto.HsqChklisttemplate2formEntities.length > 0) {
			// 				var formList = formDataService.getList();
			// 				var forms = [];
			// 				formDataService.deleteCheckListForm(angular.copy(formList));
			// 				angular.forEach(dto.HsqChklisttemplate2formEntities, function (item) {
			// 					var formData = formDataService.addCheckListForm(item, entity);
			// 					forms.push(formData);
			// 				});
			// 				if (forms.length > 0) {
			// 					formDataService.setList(forms);
			// 				}
			// 			}
			// 		}
			// 	});
			// }
		}
	}
}
