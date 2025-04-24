
import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService, IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import {IQtoDetailCommentsEntity} from '../model/entities/qto-detail-comments-entity.interface';
import {QtoMainDetailCommentsDataService} from './qto-main-detail-comments-data.service';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';


@Injectable({
    providedIn: 'root'
})
export class qtoMainDetailCommentsValidationService extends BaseValidationService<IQtoDetailCommentsEntity> {

    private validationUtils = inject(BasicsSharedDataValidationService);


    public constructor(protected dataService: QtoMainDetailCommentsDataService) {
        super();
    }

    protected generateValidationFunctions(): IValidationFunctions<IQtoDetailCommentsEntity> {
        return {
            validateBasQtoCommentsTypeFk: this.validateBasQtoCommentsTypeFk
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IQtoDetailCommentsEntity> {
        return this.dataService;
    }

    protected validateBasQtoCommentsTypeFk(info: ValidationInfo<IQtoDetailCommentsEntity>): ValidationResult {
        const entity = info.entity;
        const result = this.validationUtils.isMandatory(info);
        if (result.valid) {
            entity.BasQtoCommentsTypeFk = info.value as number;
        }
        return result;
    }
}