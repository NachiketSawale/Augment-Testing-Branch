/*
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { LogisticCardDataService } from './logistic-card-data.service';
import { ILogisticCardEntity } from '@libs/logistic/interfaces';
import { BasicsSharedNumberGenerationService } from '@libs/basics/shared';
import { number } from 'mathjs';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardValidationService extends BaseValidationService<ILogisticCardEntity>{
	private logisticCardDataService = inject(LogisticCardDataService);
	protected translateService = inject(PlatformTranslateService);
	private readonly genNumberService = inject(BasicsSharedNumberGenerationService);

	private readyForDispatchingStates: { [key: string]: boolean } = {};
	private defaultDispatchingStatesByRubricCategory: { [key: string]: number } = {};

	protected generateValidationFunctions(): IValidationFunctions<ILogisticCardEntity> {
		return {
			Code: [this.validateIsMandatory,this.validateIsUnique],
			ActualStart: this.validateActualStart,
			ActualFinish: this.validateActualFinish,
			JobCardTemplateFk: [this.validateJobCardTemplateFk/*, this.asyncValidateJobCardTemplateFk*/],
			RubricCategoryFk: this.validateRubricCategoryFk,
			WorkOperationTypeFk: this.validateWorkOperationTypeFk
		};
	}

	private validateActualStart(info: ValidationInfo<ILogisticCardEntity> ): ValidationResult {
		if(info.entity.WorkOperationTypeFk && this.isJobCardStatusReadyForDispatching(info.entity.JobCardStatusFk)){
			return this.validateIsMandatory(info);
		}
		return new ValidationResult();
	}

	private validateActualFinish(info: ValidationInfo<ILogisticCardEntity>): ValidationResult {
		if(info.entity.WorkOperationTypeFk && this.isJobCardStatusReadyForDispatching(info.entity.JobCardStatusFk)){
			return this.validateIsMandatory(info);
		}
		return new ValidationResult();
	}

	private validateJobCardTemplateFk(info: ValidationInfo<ILogisticCardEntity>): ValidationResult {
		info.entity.IsJobCardTemplateAssigned = !! info.value;
		return  { apply: true, valid: true };
	}

	// TODO: wait for migration of card template
	/*
	private async asyncValidateJobCardTemplateFk(info: ValidationInfo<ILogisticCardEntity>): Promise<ValidationResult> {

		const postParam = {
			Id: info.value
		};
		const url = this.configurationService.webApiBaseUrl + 'logistic/cardtemplate/cardtemplate/instance';
		const response = await firstValueFrom(this.http.post(url, postParam)) as ;
		if(response  && response) {

		}
	}
	 */

	private async validateAdditionalJobFk(info: ValidationInfo<ILogisticCardEntity>) {
		//TODO: basicsLookupdataLookupDescriptorService is not ready yet.
		// const jobs = $injector.get('basicsLookupdataLookupDescriptorService').getData('logisticJob');
	}

	private validateWorkOperationTypeFk(info: ValidationInfo<ILogisticCardEntity>): ValidationResult {
		const validateResult: ValidationResult = { apply: true, valid: true };

		if (info.value && this.isJobCardStatusReadyForDispatching(info.entity.JobCardStatusFk)) {
			const newInfoForActualStart = new ValidationInfo<ILogisticCardEntity>(info.entity, info.entity.ActualStart as unknown as Date, 'ActualStart');
		   this.validateIsMandatory(newInfoForActualStart);
			const newInfoForActualFinish = new ValidationInfo<ILogisticCardEntity>(info.entity, info.entity.ActualFinish as unknown as Date, 'ActualFinish');
			this.validateIsMandatory(newInfoForActualFinish);
		}else {
			this.ensureNoRelatedError(this.getEntityRuntimeData(), info, ['ActualStart']);
			this.ensureNoRelatedError(this.getEntityRuntimeData(), info, ['ActualFinish']);
		}
		return validateResult;
	}

	private async initReadyForDispatchingStates(): Promise<void> {
		// TODO: may need to provide dispatching notes module fist
		/*
		const lookupModuleQualifier = 'basics.customize.jobcardstatus';
		const params = {
			valueMember: 'Id',
			displayMember: 'Description',
			lookupModuleQualifier,
			filter: {
				customBoolProperty: 'ISREADYFORDISPATCHING',
				customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
			}
		};

		const simpleLookupService = inject(UiCommonLookupSimpleDataService);
		 */
	}

	private validateRubricCategoryFk(info: ValidationInfo<ILogisticCardEntity>): ValidationResult {
		if(info.entity.RubricCategoryFk !== info.value) {
			info.entity.JobCardStatusFk = this.getJobCardStatusDefault(info.entity.RubricCategoryFk);
			this.validateIsMandatory(info);
			return new ValidationResult();
		}
		if(info.entity.Version === 0) {
			const hasToGenerateCode = this.genNumberService.hasNumberGenerateConfig(number(info.value.toString()));
			if (hasToGenerateCode) {
				info.entity.Code = this.genNumberService.provideNumberDefaultText(number(info.value.toString())/*+,Rubric*/);
			} else {
				if (info.entity.Version === 0) {
					info.entity.Code = '';
				}
			}
			this.validateIsMandatory(info);
		}
		return new ValidationResult();
	}

	private isJobCardStatusReadyForDispatching(state: number): boolean {
		return !!this.readyForDispatchingStates[state];
	}

	private getJobCardStatusDefault(rubricCat: number): number {
		return this.defaultDispatchingStatesByRubricCategory[rubricCat];
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticCardEntity> {
		return this.logisticCardDataService;
	}
}