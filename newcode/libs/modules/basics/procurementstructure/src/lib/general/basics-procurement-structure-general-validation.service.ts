/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {BasicsProcurementStructureGeneralDataService} from './basics-procurement-structure-general-data.service';
import {PlatformTranslateService} from '@libs/platform/common';
import { IPrcConfiguration2GeneralsEntity } from '../model/entities/prc-configuration-2-generals-entity.interface';


/**
 * The validation service for ProcurementStructure general
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementStructureGeneralValidationService extends BaseValidationService<IPrcConfiguration2GeneralsEntity> {
    private dataService = inject(BasicsProcurementStructureGeneralDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);
    private translate = inject(PlatformTranslateService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcConfiguration2GeneralsEntity> {
        return {
            validateMdcLedgerContextFk: this.validateMdcLedgerContextFk,
            validatePrcConfigHeaderFk: this.validatePrcConfigHeaderFk,
            validatePrcGeneralsTypeFk: this.validatePrcGeneralsTypeFk,
            validateValueAbsolute: this.validateValueAbsolute,
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcConfiguration2GeneralsEntity> {
        return this.dataService;
    }

    protected validateMdcLedgerContextFk(info: ValidationInfo<IPrcConfiguration2GeneralsEntity>): ValidationResult {
        //todo
        /*
        let list = _.sortBy(_.filter(dataService.generalsTypeList, type => type.LedgerContextFk === value), ['isDefault', 'sorting']);
	    entity.PrcGeneralsTypeFk = _.isEmpty(list) ? null : list[0].Id;
         */
        info.entity.PrcGeneralsTypeFk = 0; //TODO: In the IPrcConfiguration2GeneralsEntity, the PrcGeneralsTypeFk type is number, so we can't assign null. The implementation of PrcGeneralsTypeFk is still pending and marked as a TODO by Alina.
        return this.validationUtils.createSuccessObject();
    }

    protected validatePrcConfigHeaderFk(info: ValidationInfo<IPrcConfiguration2GeneralsEntity>): ValidationResult {
        const result = this.validationUtils.isMandatory(info);
        if (!result.valid) {
            return result;
        }
        return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
            PrcConfigHeaderFk: <number>info.value,
            PrcGeneralsTypeFk: info.entity.PrcGeneralsTypeFk
        }, {
            key: 'basics.procurementstructure.eachConfigurationUniqueValueErrorMessage',
            params: {field1: 'Configuration', field2: 'General'}
        });
    }

    protected validatePrcGeneralsTypeFk(info: ValidationInfo<IPrcConfiguration2GeneralsEntity>): ValidationResult {
        const result = this.validationUtils.isMandatory(info);
        if (!result.valid) {
            return result;
        }
        return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
            PrcConfigHeaderFk: info.entity.PrcConfigHeaderFk,
            PrcGeneralsTypeFk: <number>info.value
        }, {
            key: 'basics.procurementstructure.eachConfigurationUniqueValueErrorMessage',
            params: {field1: 'Configuration', field2: 'General'}
        });
    }

    protected validateValueAbsolute(info: ValidationInfo<IPrcConfiguration2GeneralsEntity>): ValidationResult {
        const result = new ValidationResult();
        const value = <number>info.value;
        if (value < 0) {
            result.valid = false;
            result.error = this.translate.instant('basics.procurementstructure.generalsValueIsNegative').text;
        } else {
            //todo
            /*
            const generalsType = _.find(basicsLookupdataLookupDescriptorService.getData('PrcGeneralsType'), {Id: entity.PrcGeneralsTypeFk});
            entity.Value = generalsType && generalsType.IsNegative ? -1 * value : value;
             */
        }
        return result;
    }
}
