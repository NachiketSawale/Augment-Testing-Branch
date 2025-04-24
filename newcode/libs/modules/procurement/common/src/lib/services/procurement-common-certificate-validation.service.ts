/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IReadonlyParentService, ProcurementBaseValidationService } from '@libs/procurement/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonCertificateDataService } from './procurement-common-certificate-data.service';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';


/**
 * Procurement common Certificate validation service
 */
export abstract class ProcurementCommonCertificateValidationService<T extends IPrcCertificateEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {
    /**
     *
     * @param dataService
     * @param parentDataService
     */
    protected constructor(
        protected dataService: ProcurementCommonCertificateDataService<T, PT, PU>,
        protected parentDataService: IReadonlyParentService<PT, PU>) {
        super();
    }

    protected generateValidationFunctions(): IValidationFunctions<T> {
        return {
            BpdCertificateTypeFk: this.validateBpdCertificateTypeFk,
            GuaranteeCostPercent: this.validateGuaranteeCostPercent,
            ValidFrom: this.validateValidFrom,
            ValidTo: this.validateValidTo
            //todo -- validateEntity
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
        return this.dataService;
    }

    private validateBpdCertificateTypeFk(info: ValidationInfo<T>) {
        return this.validationUtils.isUnique(this.dataService, info, this.dataService.getList());
    }

    private validateGuaranteeCostPercent(info: ValidationInfo<T>) {
        this.dataService.recalculateAmountExp(info.entity, info.value as number);
        return this.validationUtils.createSuccessObject();
    }

    private validateValidFrom(info: ValidationInfo<T>) {
        return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, (info.entity.ValidTo) ? info.entity.ValidTo.toString() : '', 'ValidTo');
    }

    private validateValidTo(info: ValidationInfo<T>) {
        return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, (info.entity.ValidFrom) ? info.entity.ValidFrom.toString() : '', <string>info.value, 'ValidFrom');
    }

}