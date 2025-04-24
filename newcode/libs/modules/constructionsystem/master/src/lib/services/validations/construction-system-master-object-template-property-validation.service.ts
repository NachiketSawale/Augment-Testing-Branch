/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ICosObjectTemplatePropertyEntity } from '../../model/entities/cos-object-template-property-entity.interface';
import { ConstructionSystemMasterObjectTemplatePropertyDataService } from '../construction-system-master-object-template-property-data.service';
import { ConstructionSystemMasterObjectTemplatePropertyValidationBaseService } from './construction-system-master-object-template-property-validation-base.service';

/**
 * Construction system master object template property validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplatePropertyValidationService extends ConstructionSystemMasterObjectTemplatePropertyValidationBaseService<ICosObjectTemplatePropertyEntity> {
	public constructor(dataService: ConstructionSystemMasterObjectTemplatePropertyDataService) {
		super(dataService);
	}
}
