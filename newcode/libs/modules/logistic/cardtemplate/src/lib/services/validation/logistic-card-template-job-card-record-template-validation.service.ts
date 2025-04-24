/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticCardTemplateJobCardRecordTemplateValidationGeneratedService } from './generated/logistic-card-template-job-card-record-template-validation-generated.service';
import { inject, Injectable } from '@angular/core';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ILogisticCardTemplateJobCardRecordTemplateEntity } from '@libs/logistic/interfaces';
import {  PlatformLazyInjectorService, ServiceLocator } from '@libs/platform/common';
import { ResourceWorkOperationTypeLookupService } from '@libs/resource/shared';
import { firstValueFrom } from 'rxjs';
import { LogisticCardTemplateRecordReadonlyProcessorService } from '../logistic-card-template-record-readonly-processor.service';
import { LogisticCardTemplateJobCardRecordTemplateDataService } from '../data/logistic-card-template-job-card-record-template-data.service';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardTemplateJobCardRecordTemplateValidationService extends LogisticCardTemplateJobCardRecordTemplateValidationGeneratedService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly dataService = inject(LogisticCardTemplateJobCardRecordTemplateDataService);
	private readonly readonlyProcessor = new LogisticCardTemplateRecordReadonlyProcessorService(this.dataService);
	protected override handwrittenValidators = {
		CardRecordFk : () => this.mergeValidators(this.generatedValidators, v => v['CardRecordFk'], this.validateCardRecordFk ),
		JobCardRecordTypeFk : () => this.mergeValidators(this.generatedValidators, v => v['JobCardRecordTypeFk'], this.validateJobCardRecordTypeFk ),
		WorkOperationTypeFk : () => this.mergeValidators(this.generatedValidators, v => v['WorkOperationTypeFk'], this.asyncValidateWorkOperationTypeFk )
	};
	private validateCardRecordFk(info: ValidationInfo<ILogisticCardTemplateJobCardRecordTemplateEntity>): ValidationResult {
		// TODO from old client: Check weather this makes sense:
		//  if (info.value === 0) {
		// 	info.value = null;
		// }
		const res = this.validateIsMandatory(info);
		if (res.valid && typeof info.value != 'string') {
			this.dataService.setArticleInformation(info.entity);
		}
		return res;
	}
	private validateJobCardRecordTypeFk(info: ValidationInfo<ILogisticCardTemplateJobCardRecordTemplateEntity>): ValidationResult {
		info.entity.JobCardRecordTypeFk = info.value as number;
		this.asyncValidateWorkOperationTypeFk(new ValidationInfo<ILogisticCardTemplateJobCardRecordTemplateEntity>(info.entity,info.entity.WorkOperationTypeFk ?? undefined,'WorkOperationTypeFk')); //TODO: revalidate workoperationtype
		return new ValidationResult();
	}
	private async asyncValidateWorkOperationTypeFk(info: ValidationInfo<ILogisticCardTemplateJobCardRecordTemplateEntity>): Promise<ValidationResult> {
		let result = new ValidationResult();
		if(info.entity.JobCardRecordTypeFk === 1) {
			result = this.validateIsMandatory(info);
			const workOperationTypeLookupService = ServiceLocator.injector.get(ResourceWorkOperationTypeLookupService);
			const workOperationType = await firstValueFrom(workOperationTypeLookupService.getItemByKey({id: info.value as number}));
			if (workOperationType) {
				info.entity.WorkOperationIsHire = workOperationType.IsHire;
				info.entity.WorkOperationIsMinor = workOperationType.IsMinorEquipment;
				if(workOperationType.IsHire && info.entity.JobCardRecordTypeFk === 1) {
					info.entity.Quantity= 1;
					this.readonlyProcessor.process(info.entity);
					this.executeFieldValidation(new ValidationInfo(info.entity,info.entity.Quantity,'Quantity')); //TODO: Revalidate for Quantity
				}
			}
		}
		return result;
	}
}