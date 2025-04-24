/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsProcurementConfigurationRfqDocumentsDataService } from '../basics-procurement-configuration-rfqdocuments-data.service';
import { CategoryMap } from '../../model/data/category-map';
import { IPrcConfig2documentEntity } from '../../model/entities/prc-config-2-document-entity.interface';


/**
 * The basic validation service for ProcurementConfiguration Header
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementConfigurationRfqDocumentsValidationService extends BaseValidationService<IPrcConfig2documentEntity> {
    private dataService = inject(BasicsProcurementConfigurationRfqDocumentsDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcConfig2documentEntity> {
        return {
            BasRubricFk: this.validateBasRubricFk,
            PrcDocumenttypeFk: this.validatePrcDocumenttypeFk,
            PrjDocumenttypeFk: this.validatePrjDocumenttypeFk,
            BasClerkdocumenttypeFk: this.validateBasClerkdocumenttypeFk,
            SlsDocumenttypeFk: this.validateSlsDocumenttypeFk

        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcConfig2documentEntity> {
        return this.dataService;
    }

    /**
     * validateBasRubricFk
     * @param info
     * @protected
     */
    protected validateBasRubricFk(info: ValidationInfo<IPrcConfig2documentEntity>): ValidationResult {
        const result = this.validationUtils.isMandatory(info);
        if (!result.valid) {
            return result;
        }
        const value = info.value as number;

        CategoryMap.forEach(entry => {
            if (entry.category.indexOf(value) > -1) {
                const documentType  = entry.documentType;
                   this.getEntityRuntimeData().addInvalid(info.entity, {result: this.createErrorObject(documentType), field: documentType});
                
            }
        });

        this.dataService.setModified(info.entity);
        if (value > 0) {
            this.getEntityRuntimeData().removeInvalid(info.entity, {result: new ValidationResult(), field: 'BasRubricFk'});
        }
        return result;
    }

    protected validatePrcDocumenttypeFk(info: ValidationInfo<IPrcConfig2documentEntity>): ValidationResult {
        return this.validationUtils.isMandatory(info);
    }

    protected validatePrjDocumenttypeFk(info: ValidationInfo<IPrcConfig2documentEntity>): ValidationResult {
        return this.validationUtils.isMandatory(info);
    }

    protected validateBasClerkdocumenttypeFk(info: ValidationInfo<IPrcConfig2documentEntity>): ValidationResult {
        return this.validationUtils.isMandatory(info);
    }

    protected validateSlsDocumenttypeFk(info: ValidationInfo<IPrcConfig2documentEntity>): ValidationResult {
        return this.validationUtils.isMandatory(info);
    }

    private createErrorObject(field: string): ValidationResult {
        return this.validationUtils.createErrorObject({
            key: 'cloud.common.emptyOrNullValueErrorMessage',
            params: {fieldName: field.toLowerCase()}
        });
    }

    private setReadonlyAndReturnDefault(info: ValidationInfo<IPrcConfig2documentEntity>, documentType: string): number {
        CategoryMap.forEach(map => {
            this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [
                {field: map.documentType, readOnly: map.documentType !== documentType}
            ]);
            
            if (map.documentType !== documentType) {
                this.getEntityRuntimeData().removeInvalid(info.entity, {result: new ValidationResult(), field: map.documentType});
            }
        });

        // todo This feature is not yet complete
        // if (!clerk_Readonly) {
        //     docTypes = basicsLookupdataLookupDescriptorService.getData('clerkdocumenttype');
        //
        // }
        // if (!prc_Readonly) {
        //     docTypes = basicsLookupdataLookupDescriptorService.getData('prcdocumenttype');
        //
        // }
        // if (!prj_Readonly) {
        //     docTypes = basicsLookupdataLookupDescriptorService.getData('prjdocumenttype');
        //
        // }
        // if (!sales_Readonly) {
        //     docTypes = basicsLookupdataLookupDescriptorService.getData('slsdocumenttype');
        //
        // }
        // if (docTypes !== null && docTypes !== undefined) {
        //     var defaultType = docTypes[1];
        //     _.forEach(docTypes, function (item) {
        //         if (item.IsDefault === true) {
        //             defaultType = item;
        //         }
        //     });
        //     if (defaultType !== null && defaultType !== undefined) {
        //         return defaultType.Id;
        //     }
        // }

        return -1;
    }

}
