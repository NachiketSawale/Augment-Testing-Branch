/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, runInInjectionContext } from '@angular/core';
import { ControllingSharedGroupSetDataService } from './controlling-shared-group-set-data.service';
import { ControllingUnitGroupSetCompleteIdentification, IControllingUnitdGroupSetEntity, IControllingUnitGroupSetEntityIdentification } from '@libs/controlling/interfaces';
import { ControllingSharedGroupSetValidationService } from '../services/controlling-shared-group-set-validation.service';
import { ServiceLocator } from '@libs/platform/common';

/**
 * ControllingShared Group set Validation Service
 */
@Injectable({
	providedIn: 'root'
})

export class ControllingSharedGroupSetValidationFactoryService {
	public create<PT extends IControllingUnitGroupSetEntityIdentification,
		PU extends ControllingUnitGroupSetCompleteIdentification<PT>>(dataService: ControllingSharedGroupSetDataService<IControllingUnitdGroupSetEntity, PT, PU>) {
		return runInInjectionContext(ServiceLocator.injector, () => {
			return new ControllingSharedGroupSetValidationService<IControllingUnitdGroupSetEntity, PT, PU>(dataService);
		});
	}
}