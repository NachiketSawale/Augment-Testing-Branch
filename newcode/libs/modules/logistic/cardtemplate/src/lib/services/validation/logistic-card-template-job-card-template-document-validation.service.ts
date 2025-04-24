/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticCardTemplateJobCardTemplateDocumentValidationGeneratedService } from './generated/logistic-card-template-job-card-template-document-validation-generated.service';
import { Injectable } from '@angular/core';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ILogisticCardTemplateJobCardTemplateDocumentEntity } from '@libs/logistic/interfaces';
import { isNil } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardTemplateJobCardTemplateDocumentValidationService extends LogisticCardTemplateJobCardTemplateDocumentValidationGeneratedService {
	protected override handwrittenValidators = {
		Url : () => this.mergeValidators(this.generatedValidators, v => v['Url'], this.validateUrl )
	};
	private validateUrl(info: ValidationInfo<ILogisticCardTemplateJobCardTemplateDocumentEntity>): ValidationResult {
		info.entity.Url = isNil(info.entity.Url) && isNil(info.value)  ? '' : info.entity.Url;

		return  !isNil(info.entity.FileArchiveDocFk) ? new ValidationResult() : this.validateIsMandatory(info);
	}
}