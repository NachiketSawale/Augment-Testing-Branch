/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { BaseValidationService } from '@libs/platform/data-access';
import { IEstResourceEntity} from '@libs/estimate/interfaces';

@Injectable({
    providedIn: 'root',
})

/**
 * @class ProjectPlantAssemblyResourceValidationService
 * @brief Service provides validation methods for project Plant Assembly Resource properties
 */
export abstract class ProjectPlantAssemblyResourceValidationService extends BaseValidationService<IEstResourceEntity> {
   //TODO EstimateAssembliesResourceValidationService is not ready
    //private estimateAssembliesResourceValidationService = inject(EstimateAssembliesResourceValidationService);

    public CreateEstAssemblyResourceValidationService(){
        //let service = estimateAssembliesResourceValidationService.createEstAssemblyResourceValidationService(projectPlantAssemblyResourceService, projectPlantAssemblyMainService, false, false, true);
        //return service;
    }
}