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
import { ILogisticCardRecordEntity } from '@libs/logistic/interfaces';
import { LogisticCardRecordDataService } from './logistic-card-record-data.service';
import * as _ from 'lodash';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { ResourceWorkOperationTypeLookupService } from '@libs/resource/shared';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardRecordValidationService extends BaseValidationService<ILogisticCardRecordEntity>{
	private logisticCardRecordDataService = inject(LogisticCardRecordDataService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<ILogisticCardRecordEntity> {
		return {
			AcceptedQuantity: this.validateAcceptedQuantity,
			Quantity: this.validateQuantity,
			DeliveredQuantity: this.validateDeliveredQuantity,
			JobCardRecordTypeFk: this.validateAdditionalJobCardRecordTypeFk,


		};
	}

	private validateQuantity(info: ValidationInfo<ILogisticCardRecordEntity> ): ValidationResult {
		if(_.isNil(info.value)) {
			info.entity.DeliveredQuantity = info.value as unknown as number;
		}
		const result = this.validateIsMandatory(info);
		if(result && result.valid) {
			this.validateDeliveredQuantity(info);
		}
		return result;
	}

	private validateDeliveredQuantity(info: ValidationInfo<ILogisticCardRecordEntity>): ValidationResult {
		if(_.isNil(info.value)) {
			info.entity.AcceptedQuantity = info.value as unknown as number;
		}
		const result = this.validateIsMandatory(info);
		if(result && result.valid) {
			this.validateAcceptedQuantity(info);
		}
		return result;
	}

	private validateAcceptedQuantity(info: ValidationInfo<ILogisticCardRecordEntity>): ValidationResult {

		return this.validateIsMandatory(info);
	}

	private validateAdditionalJobCardRecordTypeFk(info: ValidationInfo<ILogisticCardRecordEntity>): ValidationResult {
		let readonly = true;
		if(info.value == 1){
			info.entity.WorkOperationTypeFk = null;
		} else {
			readonly = false;
		}
		this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{field: 'WorkOperationTypeFk', readOnly: readonly}]);
		const isMandatoryForWot = info.value === 1; // record type plant
		this.setWoTExternalToMandatoryIfPlantType(info.entity, info.value as unknown as number,'WorkOperationTypeFk', isMandatoryForWot);
		this.validateProcurementStructureFk(info);
		return new ValidationResult();
	}

	private validateProcurementStructureFk(info: ValidationInfo<ILogisticCardRecordEntity>): ValidationResult {
		let checkValue = info.value;
		if(_.isNil(checkValue) && _.isNil(info.entity.MaterialFk)) {
			checkValue = 1;
		}
		return this.validateIsMandatory(info);
	}

	private setWoTExternalToMandatoryIfPlantType(entity: ILogisticCardRecordEntity, value: number, field: string, isMandatory: boolean ): ValidationResult {

		const result = { apply: true, valid: false, error: '' };

		result.valid = isMandatory && !entity.WorkOperationTypeFk ? false : true;
		result.error = isMandatory ? this.translationService.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: field }).text: '';

		return result;
	}

	private async validateWorkOperationTypeFk(info: ValidationInfo<ILogisticCardRecordEntity>): Promise<ValidationResult> {
		const result = { apply: true, valid: false, error: ''};
		const workOperationTypeLookupService = ServiceLocator.injector.get(ResourceWorkOperationTypeLookupService);
		const workOperationType = await firstValueFrom(workOperationTypeLookupService.getItemByKey({ id: info.value as number}));
		if(workOperationType) {
			info.entity.WorkOperationIsHire = workOperationType.IsHire;
			info.entity.WorkOperationIsMinor = workOperationType.IsMinorEquipment;
			if(workOperationType.IsHire === true && info.entity.JobCardRecordTypeFk === 1) {

				info.entity.Quantity = 1;
				// logisticJobCardRecordProcessorService.processItem(entity);
			}
			if (info.entity.JobCardRecordTypeFk === 1 && !info.value) {
				result.valid = false;
				result.error = this.translationService.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: info.field }).text;
			}
		}
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticCardRecordEntity> {
		return this.logisticCardRecordDataService;
	}
}