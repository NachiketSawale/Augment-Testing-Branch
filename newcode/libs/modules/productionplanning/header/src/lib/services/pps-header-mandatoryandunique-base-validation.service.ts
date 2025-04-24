/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { BaseValidationService, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { PlatformTranslateService } from '@libs/platform/common';

export abstract class PpsHeaderMandatoryAndUniqueBaseValidationService<T extends object> extends BaseValidationService<T> {

	private translateService: PlatformTranslateService = inject(PlatformTranslateService);

	protected validateIsMandatoryAndUnique(info: ValidationInfo<T>, validateIsUniqueFn: (info: ValidationInfo<T>) => boolean, errorTranslateKey: string) {
		const result = this.validateIsMandatory(info);
		if (result && result.valid === true) {
			const isUnique = validateIsUniqueFn(info);
			if (isUnique) {
				return new ValidationResult();
			} else {
				// corresponding method ensureNoRelatedError should be provided by platform in the future
				// platformDataValidationService.ensureNoRelatedError(entity, model, [relModel], validationService, dataService);

				return new ValidationResult(this.translateService.instant(errorTranslateKey).text);
			}
		} else {
			return result;
		}
	}
}