/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry, IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {QtoMainDetailDocumentDataService} from './qto-main-detail-document-data.service';
import {IQtoDetailDocumentEntity} from '../model/entities/qto-detail-document-entity.interface';


@Injectable({
    providedIn: 'root'
})
export class QtoMainDetailDocumentValidationService extends BaseValidationService<IQtoDetailDocumentEntity> {

    private validationUtils = inject(BasicsSharedDataValidationService);


    public constructor(protected dataService: QtoMainDetailDocumentDataService) {
        super();
        dataService.dataValidationService = this;
    }
    /**
     * Define validation methods
     * @protected
     */
    protected generateValidationFunctions(): IValidationFunctions<IQtoDetailDocumentEntity> {
        return {
            validateQtoDetailDocumentOriginFileName: this.validateQtoDetailDocumentOriginFileName,
            validateQtoDetailDocumentTypeFk : this.validateQtoDetailDocumentTypeFk,
            validateQtoDetailDocumentFileArchiveDocFk : this.validateQtoDetailDocumentFileArchiveDocFk
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IQtoDetailDocumentEntity> {
        return this.dataService;
    }
    /**
     * Verify toDetailDocument OriginFileName
     * @protected
     */
    protected validateQtoDetailDocumentOriginFileName(info: ValidationInfo<IQtoDetailDocumentEntity>): ValidationResult {
        const entity = info.entity;
        const result = this.validationUtils.isMandatory(info);
        if (result.valid) {
            entity.OriginFileName = info.value as string;
        }
        return result;
    }
    /**
     * Verify toDetailDocument TypeFk
     * @protected
     */
    protected validateQtoDetailDocumentTypeFk(info: ValidationInfo<IQtoDetailDocumentEntity>): ValidationResult {
        const entity = info.entity;
        const result = this.validationUtils.isMandatory(info);
        if (result.valid) {
            entity.QtoDetailDocumentTypeFk = info.value as number;
        }
        return result;
    }
    /**
     * Verify toDetailDocument FileArchiveDocFk
     * @protected
     */
    protected validateQtoDetailDocumentFileArchiveDocFk(info: ValidationInfo<IQtoDetailDocumentEntity>): ValidationResult {
        const entity = info.entity;
        const result = this.validationUtils.isMandatory(info);
        if (result.valid) {
            entity.FileArchiveDocFk = info.value as number;
        }
        return result;
    }
}
