/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { RfqBidders } from '../types/rfq-bidders.type';
import { GenericWizardConfigService } from '../../../services/base/generic-wizard-config.service';
import { RfqBidderWizardContainers } from '../enum/rfq-bidder-containers.enum';
import { GenericWizardValidationService } from '../../../services/base/generic-wizard-validation.service';
import { PlatformLazyInjectorService, Translatable } from '@libs/platform/common';
import { updateContactHasPortalUserField } from '../logic/contact-portal-user-fn';

@Injectable({
    providedIn: 'root'
})
export class RfqBidderValidationService extends BaseValidationService<RfqBidders> {

    private readonly wizardConfigService = inject(GenericWizardConfigService);
    private readonly validationService = inject(GenericWizardValidationService);
    private readonly lazyInjectorService = inject(PlatformLazyInjectorService);

    protected override generateValidationFunctions(): IValidationFunctions<RfqBidders> {
        return {
            isIncluded : [this.validateIncluded],
            ContactFk: [this.validateContactFk]
        };
    }
    protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<RfqBidders> {
        return this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER);
    }

    private validateIncluded(info: ValidationInfo<RfqBidders>): ValidationResult {
        const errors: Translatable[] = [];

        const validationResult: ValidationResult = {
			valid: true
		};
        const items = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER).getList();
        const item = items.find(item => item.Id === info.entity.Id);
        if(item) {
            item.isIncluded = info.value as boolean;
        }
        const includedItems = items.filter(item => item.isIncluded);

        if(includedItems.length === 0) {
            errors.push({text:'No bidders selected!'});
        }

        this.validationService.updateOrAdd(RfqBidderWizardContainers.RFQ_BIDDER, 'isIncluded', errors);
        return validationResult;
    }

    private async validateContactFk(info: ValidationInfo<RfqBidders>): Promise<ValidationResult> {
        info.entity.ContactFk = info.value as number;
        await updateContactHasPortalUserField([info.entity], this.lazyInjectorService);
        const validationResult: ValidationResult = {
			valid: true
		};
        return validationResult;
    }

}