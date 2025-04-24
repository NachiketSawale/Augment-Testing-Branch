/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})

/**
 * @class ProjectPlantAssemblyFilterService
 * @brief Service provides Filter methods for Project Plant Assembly
 */
export class ProjectPlantAssemblyFilterService {
    //TODO EstimateAssembliesFilterServiceFactory is not ready
    //private estimateAssembliesFilterServiceFactory = inject(EstimateAssembliesFilterServiceFactory);

    public CreateEstimateAssembliesFilterService(){
      //  let service = estimateAssembliesFilterServiceFactory.createEstAssembliesFilterService('project','plantassembly');
        //return service;
    }
}