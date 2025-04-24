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
    IProjectMaterialUpdateMaterialPriceByItemPriceList
} from '../../model/entities/project-material-update-material-price-by-item-price-list.interface';
import {
    ProjectMaterialUpdatePriceByMaterialItemListDataService
} from './project-material-update-price-by-material-item-list-data.service';
import {ProjectMaterialUpdatePriceFromCatalogMainService} from './project-material-update-price-from-catalog-main.service';
import {PlatformTranslateService} from '@libs/platform/common';
import {FieldValidationInfo} from '@libs/ui/common';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceByMaterialItemListValidateService extends BaseValidationService<IProjectMaterialUpdateMaterialPriceByItemPriceList> {

    private readonly dataService: ProjectMaterialUpdatePriceByMaterialItemListDataService = inject(ProjectMaterialUpdatePriceByMaterialItemListDataService);
    private readonly projUpdatePriceFromCatalogMainService = inject(ProjectMaterialUpdatePriceFromCatalogMainService);
    private readonly translateService = inject(PlatformTranslateService);

    protected generateValidationFunctions(): IValidationFunctions<IProjectMaterialUpdateMaterialPriceByItemPriceList> {
        return {
            Checked: this.validateChecked,
            Weighting: this.validateWeighting
        };
    }


    public validateChecked(info: FieldValidationInfo<IProjectMaterialUpdateMaterialPriceByItemPriceList>): ValidationResult {
        setTimeout(() => {
            this.dataService.changeSourceOption();
            const selectInfo = this.dataService.collectSourceInfo();
            this.projUpdatePriceFromCatalogMainService.PriceListSelectionChanged.emit(selectInfo);
        });

        return new ValidationResult();
    }

    public validateWeighting(info: FieldValidationInfo<IProjectMaterialUpdateMaterialPriceByItemPriceList>): ValidationResult {
        const result = new ValidationResult();
        if(!info.value || (info.value as number) < 0){
            result.valid = false;
            result.error = this.translateService.instant('project.main.updatePriceFromCatalogWizard.weightingGreaterThanZeroError').text;
        }

        setTimeout(() => {
            if(info.entity.Checked && result.valid){
                this.dataService.changeSourceOption();
                const selectInfo = this.dataService.collectSourceInfo();
                this.projUpdatePriceFromCatalogMainService.PriceListSelectionChanged.emit(selectInfo);
            }
        });

        return new ValidationResult();
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectMaterialUpdateMaterialPriceByItemPriceList> {
        throw new Error('Method not implemented.');
    }

}