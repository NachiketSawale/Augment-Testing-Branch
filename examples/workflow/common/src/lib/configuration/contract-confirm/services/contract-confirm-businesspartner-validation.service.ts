/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { GenericWizardConfigService } from '../../../services/base/generic-wizard-config.service';
import { GenericWizardValidationService } from '../../../services/base/generic-wizard-validation.service';
import { Translatable } from '@libs/platform/common';
import { ContractConfirmWizardContainers } from '../enum/contract-confirm-containers.enum';
import { RfqBidders } from '../../rfq-bidder/types/rfq-bidders.type';

/**
 * Validation service for having at least one business partner included for contract confirm wizard.
 */
@Injectable({
  providedIn: 'root'
})
export class ContractConfirmBusinesspartnerValidationService extends BaseValidationService<RfqBidders> {

  private readonly configService = inject(GenericWizardConfigService);
  private readonly validationService = inject(GenericWizardValidationService);

  protected override generateValidationFunctions(): IValidationFunctions<RfqBidders> {
    return {
      isIncluded: [this.includedBusinessPartnerList],
    };
  }
  protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<RfqBidders> {
    return this.configService.getService(ContractConfirmWizardContainers.CON_BUSINESSPARTNER);
  }

  private includedBusinessPartnerList(info: ValidationInfo<RfqBidders>): ValidationResult {
    const errors: Translatable[] = [];

    const validationResult: ValidationResult = {
      valid: true
    };
    const items = this.configService.getService(ContractConfirmWizardContainers.CON_BUSINESSPARTNER).getList();
    const item = items.find(item => item.Id === info.entity.Id);
    if (item) {
      item.isIncluded = info.value as boolean;
    }
    const includedItems = items.filter(item => item.isIncluded);

    if (includedItems.length === 0) {
      errors.push({
        key: 'procurement.rfq.rfqBidderWizard.noBusinessPartnerSelectedErrorText',
        text: 'No business partners selected!'
      });
    }

    this.validationService.updateOrAdd(ContractConfirmWizardContainers.CON_BUSINESSPARTNER, 'isIncluded', errors);
    return validationResult;
  }

}
