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
import { ILogisticCardDocumentEntity } from '@libs/logistic/interfaces';
import * as _ from 'lodash';
import { LogisticCardDocumentDataService } from './logistic-card-document-data.service';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardDocumentValidationService extends BaseValidationService<ILogisticCardDocumentEntity>{
	private logisticCardDocumentDataService = inject(LogisticCardDocumentDataService);
	protected generateValidationFunctions(): IValidationFunctions<ILogisticCardDocumentEntity> {
		return {
			Url: this.validateUrl
		};
	}

	private validateUrl(info: ValidationInfo<ILogisticCardDocumentEntity>): ValidationResult {
		info.entity.Url = _.isNil(info.entity.Url) && _.isNil(info.value) ? '' : info.entity.Url;
		if(!_.isNil(info.entity.FileArchiveDocFk)) {
			return new ValidationResult();
		} else {
			return this.validateIsMandatory(info);
		}
	}


	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticCardDocumentEntity> {
		return this.logisticCardDocumentDataService;
	}
}