/*
 * Copyright(c) RIB Software GmbH
 */

import {
	 ValidationInfo, ValidationResult,
} from '@libs/platform/data-access';
import {inject, Injectable} from '@angular/core';
import { BasicsMaterialScopeDataService } from './basics-material-scope-data.service';
import { BasicsMaterialScopeDetailDataService } from '../scope-detail/basics-material-scope-detail-data.service';
import { BasicsScopeValidationService } from './basics-scope-validation-service.class';
import { IMaterialScopeEntity } from '@libs/basics/interfaces';

/**
 * Material scope validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialScopeValidationService extends BasicsScopeValidationService<IMaterialScopeEntity> {
	private readonly scopeDetailDataService = inject(BasicsMaterialScopeDetailDataService);

	public constructor(dataService: BasicsMaterialScopeDataService) {
		super(dataService);
	}

	protected override validateIsSelected(info: ValidationInfo<IMaterialScopeEntity>): ValidationResult {
		const result = super.validateIsSelected(info);
		this.scopeDetailDataService.applyScopeTotal();
		return result;
	}
}