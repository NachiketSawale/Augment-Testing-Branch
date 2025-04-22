/*
 * Copyright(c) RIB Software GmbH
 */

import { GenericWizardUseCaseUuid } from '../../../models/enum/generic-wizard-use-case-uuid.enum';
import { ContractApprovalWizardConfig } from '../../contract-approval/types/contract-approval-wizard-config.type';
import { ContractConfirmWizardConfig } from '../../contract-confirm/types/contract-confirm-wizard-config.type';
import { RfqBidderWizardConfig } from '../../rfq-bidder/types/rfq-bidder-wizard-config.type';
import { GenericTypeValueUnion } from './generic-type-union.type';

/**
 * A map of generic wizard instances to their respective wizard configuration.
 * These are the configurations that will be available to load providers before loading the wizard and to make runtime calls during the loading of the wizard.
 */
export type GenericWizardUseCaseConfigMap = {
    [GenericWizardUseCaseUuid.RfqBidder]: RfqBidderWizardConfig;
    [GenericWizardUseCaseUuid.ContractConfirm]: ContractConfirmWizardConfig;
    [GenericWizardUseCaseUuid.ContractApproval]: ContractApprovalWizardConfig;
};

/**
 * Common wizard configuration object.
 */
export type GenericWizardConfig = GenericTypeValueUnion<GenericWizardUseCaseConfigMap>;