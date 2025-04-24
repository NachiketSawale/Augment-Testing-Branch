/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationResult
} from '@libs/platform/data-access';
import {
    IUpdateMaterialPriceByItemEntity
} from '../../model/entities/project-material-update-material-price-by-item.interface';
import {inject, Injectable} from '@angular/core';
import {
    ProjectMaterialUpdatePriceByMaterialItemDataService
} from './project-material-update-price-by-material-item-data.service';
import {FieldValidationInfo} from '@libs/ui/common';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceByMaterialItemValidateService extends BaseValidationService<IUpdateMaterialPriceByItemEntity> {

    private readonly dataService: ProjectMaterialUpdatePriceByMaterialItemDataService = inject(ProjectMaterialUpdatePriceByMaterialItemDataService);

    protected generateValidationFunctions(): IValidationFunctions<IUpdateMaterialPriceByItemEntity> {
        return {
            Checked: this.validateChecked,
            NewPrjEstimatePrice: this.validateNewPrjEstimatePrice
        };
    }


    public validateChecked(info: FieldValidationInfo<IUpdateMaterialPriceByItemEntity>): ValidationResult {
        return new ValidationResult();
    }

    public validateNewPrjEstimatePrice(info: FieldValidationInfo<IUpdateMaterialPriceByItemEntity>): ValidationResult {

        setTimeout(() => {
            this.dataService.calculateVariance(info.entity);
            this.dataService.gridRefresh();
        });

        return new ValidationResult();
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IUpdateMaterialPriceByItemEntity> {
        throw new Error('Method not implemented.');
    }

}