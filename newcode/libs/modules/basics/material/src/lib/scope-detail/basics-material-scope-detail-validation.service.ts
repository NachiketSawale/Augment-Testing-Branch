/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsMaterialScopeDetailDataService } from '../scope-detail/basics-material-scope-detail-data.service';
import { BasicsScopeDetailValidationService } from './basics-scope-detail-validation-service.class';
import { IMaterialScopeDetailEntity } from '@libs/basics/interfaces';

/**
 * Material scope detail validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialScopeDetailValidationService extends BasicsScopeDetailValidationService<IMaterialScopeDetailEntity> {

	public constructor(private materialScopeDetailDS: BasicsMaterialScopeDetailDataService) {
		super(materialScopeDetailDS);
	}

}