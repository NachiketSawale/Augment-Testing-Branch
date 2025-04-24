/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions} from '@libs/platform/data-access';
import { IKeyFigureEntity } from '@libs/project/interfaces';
import { ProjectMainKeyFigureDataService } from './project-main-key-figure-data.service';


@Injectable({
	providedIn: 'root'
})

export class ProjectMainKeyFigureValidationService extends BaseValidationService<IKeyFigureEntity> {

	private ProjectMainKeyFigureDataService = inject(ProjectMainKeyFigureDataService);

    protected generateValidationFunctions(): IValidationFunctions<IKeyFigureEntity> {
        throw new Error('Method not implemented.');
    }
    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IKeyFigureEntity> {
        throw new Error('Method not implemented.');
    }


}