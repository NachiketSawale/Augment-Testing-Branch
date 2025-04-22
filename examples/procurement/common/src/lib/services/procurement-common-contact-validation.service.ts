/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IReadonlyParentService, ProcurementBaseValidationService } from '@libs/procurement/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonContactDataService } from './procurement-common-contact-data.service';
import { inject } from '@angular/core';
import { IPrcContactEntity } from '../model/entities/prc-contact-entity.interface';
import { firstValueFrom } from 'rxjs';
import { BusinesspartnerSharedContactLookupService } from '@libs/businesspartner/shared';


/**
 * Procurement common Contact validation service
 */
export abstract class ProcurementCommonContactValidationService<T extends IPrcContactEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {
    private readonly contactLookupService = inject(BusinesspartnerSharedContactLookupService);

    /**
     *
     * @param dataService
     * @param parentDataService
     */
    protected constructor(
        protected dataService: ProcurementCommonContactDataService<T, PT, PU>,
        protected parentDataService: IReadonlyParentService<PT, PU>) {
        super();
    }

    protected generateValidationFunctions(): IValidationFunctions<T> {
        return {
            BpdContactFk: this.validateBpdContactFk,
            //todo -- validateEntity
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
        return this.dataService;
    }

    private async validateBpdContactFk(info: ValidationInfo<T>) {
        if (info.value === 0 || info.value === null) {
            return this.validationUtils.createErrorObject({
                key: 'cloud.common.emptyOrNullValueErrorMessage',
                params: {fieldName: 'basics.clerk.entityFamilyName'}
            });
        }
        const contact = await firstValueFrom(this.contactLookupService.getItemByKey({id: info.value as number}));
        if (contact?.ContactRoleFk) {
            info.entity.BpdContactRoleFk = contact.ContactRoleFk;
        }
        return this.validationUtils.createSuccessObject();
    }
}