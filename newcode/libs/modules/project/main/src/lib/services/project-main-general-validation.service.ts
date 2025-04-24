/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { IGeneralEntity } from '@libs/project/interfaces';
import { ProjectMainGeneralDataService } from './project-main-general-data.service';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainGeneralValidationService extends BaseValidationService<IGeneralEntity> {

	private projectMainGeneralDataService = inject(ProjectMainGeneralDataService);

    protected generateValidationFunctions(): IValidationFunctions<IGeneralEntity> {
        throw new Error('Method not implemented.');
    }
    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IGeneralEntity> {
        throw new Error('Method not implemented.');
    }


}