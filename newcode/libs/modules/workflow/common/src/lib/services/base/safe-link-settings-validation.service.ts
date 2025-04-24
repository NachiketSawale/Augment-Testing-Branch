/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationResult } from '@libs/platform/data-access';
import { GenericWizardConfigService } from './generic-wizard-config.service';
import { GenericWizardValidationService } from './generic-wizard-validation.service';
import { Translatable } from '@libs/platform/common';
import { IGenericWizardReportEntity } from '../../configuration/rfq-bidder/types/generic-wizard-report-entity.interface';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { IReportParameterEntity } from '@libs/basics/reporting';
import { GenericWizardReportParameter } from '../../configuration/rfq-bidder/types/generic-wizard-report-parameter-entity.interface';
import { RfqBidderWizardContainers } from '../../configuration/rfq-bidder/enum/rfq-bidder-containers.enum';
import { ContractConfirmWizardContainers } from '../../configuration/contract-confirm/enum/contract-confirm-containers.enum';

@Injectable({
  providedIn: 'root'
})
export class SafeLinkSettingsValidationService extends BaseValidationService<IGenericWizardReportEntity> {

  public constructor(private readonly configService: GenericWizardConfigService) {
    super();

  }
  private readonly validationService = inject(GenericWizardValidationService);
  protected override generateValidationFunctions(): IValidationFunctions<IGenericWizardReportEntity> {
    return {
      isIncluded: [this.validateSafeLinkSettings] //Todo : which parameter to consider for safe link validation.
    };
  }
  protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<IGenericWizardReportEntity> {
    const instanceUuid = this.configService.getWizardInstanceUuid();
    const isContractConfirmWizard = instanceUuid === GenericWizardUseCaseUuid.ContractConfirm ? true : false;

    return isContractConfirmWizard ?
      this.configService.getService(ContractConfirmWizardContainers.CONTRACT_CONFIRM_COVER_LETTER) :
      this.configService.getService(RfqBidderWizardContainers.RFQ_BIDDER_COVER_LETTER);

  }

  /**
   * Function to validate the cover letter report parameters.
   * @returns
   */
  public validateSafeLinkSettings(): ValidationResult {
    const errors: Translatable[] = [];

    const validationResult: ValidationResult = {
      valid: true
    };

    let isContractConfirmWizard: boolean = false;
    if (this.configService !== undefined) {
      const instanceUuid = this.configService.getWizardInstanceUuid();
      isContractConfirmWizard = instanceUuid === GenericWizardUseCaseUuid.ContractConfirm ? true : false;
    }

    const list: IGenericWizardReportEntity[] = isContractConfirmWizard
      ? this.configService
        .getService(ContractConfirmWizardContainers.CONTRACT_CONFIRM_COVER_LETTER)
        .getList()
      : this.configService
        .getService(RfqBidderWizardContainers.RFQ_BIDDER_COVER_LETTER)
        .getList();

    const selectedBodyLetter =
      list.find((item) => item.isIncluded) ||
      list.find((item) => item.IsDefault) ||
      list[0];

    const config = this.configService.getWizardConfig();

    if (config.communicationChannel === 2 && selectedBodyLetter) {
      const bidderSettingsService = this.configService.getService(RfqBidderWizardContainers.RFQ_BIDDER_SETTINGS);
      const wizardSettings = bidderSettingsService.getList()[0];
      const selectedBodyLetterParameters =
        selectedBodyLetter.ReportParameterEntities ||
        [...(selectedBodyLetter.parameters || []), ...(selectedBodyLetter.hiddenParameters || [])];
      const isLetterForSafeLink = selectedBodyLetterParameters.some((param: IReportParameterEntity | GenericWizardReportParameter) => {
        if (this.isIReportParameterEntity(param)) {
          return param.ParameterName?.toLowerCase() === 'link';
        } else if (this.isGenericWizardReportParameter(param)) {
          return param.Name?.toLowerCase() === 'link';
        }
        return false;
      });
      const safeLinkSettingsValid = (wizardSettings.GenerateSafeLink === true && isLetterForSafeLink === true) || (wizardSettings.GenerateSafeLink === false && isLetterForSafeLink === false);
      if (!safeLinkSettingsValid) {
        errors.push({ text: 'The selected cover letter does noy match your generate safe link settings' });

      }
      const uuid = isContractConfirmWizard ? ContractConfirmWizardContainers.CONTRACT_CONFIRM_COVER_LETTER : RfqBidderWizardContainers.RFQ_BIDDER_COVER_LETTER;
      this.validationService.updateOrAdd(uuid, 'isIncluded', errors);

    }
    return validationResult;
  }

  private isIReportParameterEntity(param: IReportParameterEntity | GenericWizardReportParameter): param is IReportParameterEntity {
    return 'ParameterName' in param;
  }

  private isGenericWizardReportParameter(param: IReportParameterEntity | GenericWizardReportParameter): param is GenericWizardReportParameter {
    return 'Name' in param;
  }
}
