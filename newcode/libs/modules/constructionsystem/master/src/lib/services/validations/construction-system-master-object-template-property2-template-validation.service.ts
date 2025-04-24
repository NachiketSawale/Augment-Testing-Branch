/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ICosObjectTemplateProperty2TemplateEntity } from '../../model/entities/cos-object-template-property-2-template-entity.interface';
import { ConstructionSystemMasterObjectTemplateProperty2TemplateDataService } from '../construction-system-master-object-template-property2-template-data.service';
import { ConstructionSystemMasterObjectTemplatePropertyValidationBaseService } from './construction-system-master-object-template-property-validation-base.service';

/**
 * Construction system master object template property 2 template validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplateProperty2TemplateValidationService extends ConstructionSystemMasterObjectTemplatePropertyValidationBaseService<ICosObjectTemplateProperty2TemplateEntity> {
	public constructor(dataService: ConstructionSystemMasterObjectTemplateProperty2TemplateDataService) {
		super(dataService);
	}
}
