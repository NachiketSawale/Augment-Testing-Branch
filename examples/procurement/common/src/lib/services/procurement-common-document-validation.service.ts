/*
 * Copyright(c) RIB Software GmbH
 */

import {
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import {IReadonlyParentService, ProcurementBaseValidationService} from '@libs/procurement/shared';
import {IPrcDocumentEntity} from '../model/entities';
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import {ProcurementCommonDocumentDataService} from './procurement-common-document-data.service';

/**
 * Procurement common Document validation service
 */
export abstract class ProcurementCommonDocumentValidationService<T extends IPrcDocumentEntity,  PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {
    /**
     *
     * @param dataService
     * @param parentDataService
     */
    protected constructor(
        protected dataService: ProcurementCommonDocumentDataService<T, PT, PU>,
        protected parentDataService:IReadonlyParentService<PT, PU>) {
        super();
    }

    protected generateValidationFunctions(): IValidationFunctions<T> {
        return {
            DocumentTypeFk: this.validateDocumentTypeFk,
            OriginFileName: this.validateOriginFileName,
           //todo -- validateEntity
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
        return this.dataService;
    }

    protected validateDocumentTypeFk(info: ValidationInfo<T>) {
        info.entity.OriginFileName = null;
        const selectedEntity = this.parentDataService.getSelectedEntity();
        if(selectedEntity){
            //todo--set DocumentTypeFk field readonly
           // this.parentDataService.updateReadOnly('DocumentTypeFk')
        }
        return this.validateIsMandatory(info);
    }
    protected validateOriginFileName(info: ValidationInfo<T>) {
        //todo--moment is not available
        //info.entity.DocumentDate = moment.utc(Date.now());
        //todo--set DocumentTypeFk field readonly
        // this.parentDataService.updateReadOnly('DocumentTypeFk')
        return new ValidationResult();
    }
}