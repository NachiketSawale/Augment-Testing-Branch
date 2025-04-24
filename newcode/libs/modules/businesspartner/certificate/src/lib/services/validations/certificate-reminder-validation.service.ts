/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService, IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { PlatformTranslateService } from '@libs/platform/common';
import { BusinesspartnerCertificateReminderDataService } from '../certificate-reminder-data.service';
import { get } from 'lodash';
import { ICertificateReminderEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class CertificateReminderValidationService extends BaseValidationService<ICertificateReminderEntity> {

	// region basic
	private dataService: BusinesspartnerCertificateReminderDataService = inject(BusinesspartnerCertificateReminderDataService);
	protected translateService = inject(PlatformTranslateService);
	public constructor() {
		super();
		this.dataService.requiredChanged$.subscribe((item: ICertificateReminderEntity) => {
			this.handleRequiredValidation(item);
		});
	}

	protected override generateValidationFunctions(): IValidationFunctions<ICertificateReminderEntity> {
		return {
			BatchId: this.isRequired,
			BatchDate: this.isRequired,
			CertificateStatusFk: this.isRequired,
			Telefax: this.validateTelefax

		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICertificateReminderEntity> {
		return this.dataService;
	}

	// endregion

	// region  validate

	protected handleRequiredValidation(item: ICertificateReminderEntity): void {
		const fields = ['BatchId', 'BatchDate', 'CertificateStatusFk'];

		fields.forEach(field => {
			const tempValue = get(item, field);
			const tempValidationInfo: ValidationInfo<ICertificateReminderEntity> = {
				value: tempValue,
				field: field,
				entity: item
			};
			const validationResult = this.isRequired(tempValidationInfo);
			if (!validationResult.valid) {
				this.dataService.addInvalid(item, {result: validationResult, field: field});
			} else {
				this.dataService.removeInvalid(item, {result: validationResult, field: field});
			}
		});
	}

	protected isRequired(info: ValidationInfo<ICertificateReminderEntity>): ValidationResult {
		const validationResult: ValidationResult = {apply: true, valid: true};
		if (info.value === '' || info.value === null || info.value === -1 || info.value === 0) {
			validationResult.valid = false;
			validationResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: info.field}).text;
		}
		return validationResult;
	}

	protected validateTelefax(info: ValidationInfo<ICertificateReminderEntity>): ValidationResult {
		const validationResult: ValidationResult = {apply: true, valid: true};
		if (info.value) {
			const rx = new RegExp('^(\\++)(?=[1-9]+)[0-9|\\s]*$', 'g');
			const rx2 = new RegExp('^(0{2})(?=[1-9]+)[0-9|\\s]*$', 'g');
			if (!rx.test(info.value.toString()) && !rx2.test(info.value.toString())) {
				validationResult.valid=false;
				validationResult.error= this.translateService.instant('businesspartner.certificate.error.faxFormatterError').text;
			}
		}
		return validationResult;
	}
	// endregion
}


