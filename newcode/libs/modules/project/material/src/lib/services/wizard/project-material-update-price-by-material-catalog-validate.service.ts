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
import {inject, Injectable} from '@angular/core';
import {
    IUpdateMaterialPriceByCatalogEntity
} from '../../model/entities/project-material-update-material-price-by-catalog.interface';
import {
    ProjectMaterialUpdatePriceByMaterialCatalogDataService
} from './project-material-update-price-by-material-catalog-data.service';
import * as _ from 'lodash';
import {FieldValidationInfo} from '@libs/ui/common';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceByMaterialCatalogValidateService extends BaseValidationService<IUpdateMaterialPriceByCatalogEntity> {

    private readonly dataService: ProjectMaterialUpdatePriceByMaterialCatalogDataService = inject(ProjectMaterialUpdatePriceByMaterialCatalogDataService);

    public generateValidationFunctions(): IValidationFunctions<IUpdateMaterialPriceByCatalogEntity> {
        return {
            Checked: this.validateChecked,
            NewPrjEstimatePrice: this.validateNewPrjEstimatePrice
        };
    }


    public validateChecked(info: FieldValidationInfo<IUpdateMaterialPriceByCatalogEntity>): ValidationResult {

        setTimeout(() => {
            const list = this.dataService.PriceByCatalogList;
            if(info.entity.MaterialCatalogFk){
                const parent = _.find(list, {Id: info.entity.MaterialCatalogFk});
                if(info.value && parent){
                    parent.Checked = true;
                }else if(!info.value && parent){
                    const checkedChild = _.find(parent.Children, {Checked: true});
                    if(!checkedChild){
                        parent.Checked = false;
                    }
                }
            }else{
                if(info.entity.Children && info.entity.Children.length > 0){
                    _.forEach(info.entity.Children, function (child){
                        child.Checked = !!info.value;
                    });
                }
            }

            this.dataService.gridRefresh();
        });

        return new ValidationResult();
    }

    public validateNewPrjEstimatePrice(info: FieldValidationInfo<IUpdateMaterialPriceByCatalogEntity>): ValidationResult {

        setTimeout(() => {
            this.dataService.calculateVariance(info.entity);
            this.dataService.gridRefresh();
        });

        return new ValidationResult();
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IUpdateMaterialPriceByCatalogEntity> {
        throw new Error('Method not implemented.');
    }

}