/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IPrcStructureEventEntity } from '../model/entities/prc-structure-event-entity.interface';
import { BasicsProcurementStructureEventDataService } from './basics-procurement-structure-event-data.service';
import { PlatformTranslateService } from '@libs/platform/common';


/**
 *  validation service for procurement structure event
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementStructureEventValidationService extends BaseValidationService<IPrcStructureEventEntity> {
    private dataService = inject(BasicsProcurementStructureEventDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);
    private translationService = inject(PlatformTranslateService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcStructureEventEntity> {
        return {
            validatePrcSystemEventTypeStartFk: this.validatePrcSystemEventTypeStartFk,
            validatePrcEventTypeStartFk: this.validatePrcEventTypeStartFk,
            validatePrcSystemEventTypeEndFk: this.validatePrcSystemEventTypeEndFk,
            validatePrcEventTypeEndFk: this.validatePrcEventTypeEndFk,
            validatePrcEventTypeFk: this.validatePrcEventTypeFk,
            validateSorting: this.validateSorting,
            validateStartNoOfDays: this.validateStartNoOfDays,
            validateEndNoOfDays: this.validateEndNoOfDays,
            validateStartBasis: this.validateStartBasis,
            validateEndBasis: this.validateEndBasis
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcStructureEventEntity> {
        return this.dataService;
    }

    protected validatePrcSystemEventTypeStartFk(info: ValidationInfo<IPrcStructureEventEntity>): ValidationResult {
        const isReadOnly = <number>info.value !== null;
        info.entity.PrcEventTypeStartFk = null;
        this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
            field: 'PrcEventTypeStartFk',
            readOnly: isReadOnly
        }]);
        return this.validationUtils.createSuccessObject();
    }

    protected validatePrcEventTypeStartFk(info: ValidationInfo<IPrcStructureEventEntity>): ValidationResult {
        const isReadOnly = <number>info.value !== null;
        info.entity.PrcSystemEventTypeStartFk = null;
        this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
            field: 'PrcSystemEventTypeStartFk',
            readOnly: isReadOnly
        }]);
        return this.validationUtils.createSuccessObject();
    }

    protected validatePrcSystemEventTypeEndFk(info: ValidationInfo<IPrcStructureEventEntity>): ValidationResult {
        const isReadOnly = <number>info.value !== null;
        info.entity.PrcEventTypeEndFk = null;
        this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
            field: 'PrcEventTypeEndFk',
            readOnly: isReadOnly
        }]);
        return this.validationUtils.createSuccessObject();
    }

    protected validatePrcEventTypeEndFk(info: ValidationInfo<IPrcStructureEventEntity>): ValidationResult {
        const isReadOnly = <number>info.value !== null;
        info.entity.PrcSystemEventTypeEndFk = null;
        this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
            field: 'PrcSystemEventTypeEndFk',
            readOnly: isReadOnly
        }]);
        return this.validationUtils.createSuccessObject();
    }

    protected validatePrcEventTypeFk(info: ValidationInfo<IPrcStructureEventEntity>): ValidationResult {
        const items = this.dataService.getList();
        return this.validationUtils.isUniqueAndMandatory(info, items, 'basics.procurementstructure.eventTypeUniqueError');
    }

    protected validateSorting(info: ValidationInfo<IPrcStructureEventEntity>): ValidationResult {
        return this.validationUtils.isUnique(this.dataService, info, this.dataService.getList(), false);
    }

    protected validateStartNoOfDays(info: ValidationInfo<IPrcStructureEventEntity>): ValidationResult {
        return this.validationUtils.isMandatory(info);
    }

    protected validateEndNoOfDays(info: ValidationInfo<IPrcStructureEventEntity>): ValidationResult {
        return this.validationUtils.isMandatory(info);
    }

    protected validateStartBasis(info: ValidationInfo<IPrcStructureEventEntity>): ValidationResult {
        switch (info.value) {
            case 1:
            case 2:
                info.entity.PrcSystemEventTypeStartFk = null;
                info.entity.PrcEventTypeStartFk = null;
                this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
                    field: 'PrcSystemEventTypeStartFk',
                    readOnly: true
                }, { field: 'PrcEventTypeStartFk', readOnly: true }]);
                break;
            case 3:
            case 4:
                info.entity.PrcEventTypeStartFk = null;
                this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
                    field: 'PrcSystemEventTypeStartFk',
                    readOnly: false
                }, { field: 'PrcEventTypeStartFk', readOnly: true }]);
                break;
            case 5:
            case 6:
            case 7:
            case 8:
                info.entity.PrcSystemEventTypeStartFk = null;
                this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
                    field: 'PrcSystemEventTypeStartFk',
                    readOnly: true
                }, { field: 'PrcEventTypeStartFk', readOnly: false }]);
                break;
        }
        this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
            field: 'AddLeadTimeToStart',
            readOnly: info.value === 1
        }]);
        return this.validationUtils.isMandatory(info);
    }

    protected validateEndBasis(info: ValidationInfo<IPrcStructureEventEntity>): ValidationResult {
        switch (info.value) {
            case 1:
            case 2:
                info.entity.PrcSystemEventTypeEndFk = null;
                info.entity.PrcEventTypeEndFk = null;
                this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
                    field: 'PrcSystemEventTypeEndFk',
                    readOnly: true
                }, { field: 'PrcEventTypeEndFk', readOnly: true }]);
                break;
            case 3:
            case 4:
                info.entity.PrcEventTypeEndFk = null;
                this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
                    field: 'PrcSystemEventTypeEndFk',
                    readOnly: false
                }, { field: 'PrcEventTypeEndFk', readOnly: true }]);
                break;
            case 5:
            case 6:
            case 7:
            case 8:
                info.entity.PrcSystemEventTypeEndFk = null;
                this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
                    field: 'PrcSystemEventTypeEndFk',
                    readOnly: true
                }, { field: 'PrcEventTypeEndFk', readOnly: false }]);
                break;
        }
        this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{
            field: 'AddLeadTimeToEnd',
            readOnly: info.value === 1
        }]);
        return this.validationUtils.isMandatory(info);
    }
}
