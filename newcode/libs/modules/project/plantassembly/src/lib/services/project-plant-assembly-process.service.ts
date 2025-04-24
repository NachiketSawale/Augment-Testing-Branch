/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import {IEstLineItemEntity} from '@libs/estimate/interfaces';
import {ProjectPlantAssemblyMainService} from '../containers/assemblies/project-plant-assembly-main.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Service for Project Plant Assembly process service
 */
export class ProjectPlantAssemblyProcessService implements IEntityProcessor<IEstLineItemEntity> {


   private constructor( private dataService: ProjectPlantAssemblyMainService){}
   

    /**
     * Processes the given project cost code entity.
     * @param item The project cost code entity to process.
     */
    public process(item: IEstLineItemEntity): void {
        if (!item) {
            return;
        }

        const flag = false;

        const readonlyFields: IReadOnlyField<IEstLineItemEntity>[] = [
            {field: 'QuantityFactor1', readOnly: flag},
            {field: 'QuantityFactor2', readOnly: flag},
            {field: 'QuantityFactor3', readOnly: flag},
            {field: 'QuantityFactor4', readOnly: flag},
            {field: 'CostFactor1', readOnly: flag},
            {field: 'CostFactor2', readOnly: flag},
            {field: 'PlantAssemblyTypeFk', readOnly: !item.EstAssemblyFk},
        ];

        this.dataService.setEntityReadOnlyFields(item, readonlyFields);
    }

    /**
     * Reverts any processing changes made to project plant assembly entities.
     */
    public revertProcess(): void {}
}
