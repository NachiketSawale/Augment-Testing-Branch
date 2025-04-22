/*
 * Copyright(c) RIB Software GmbH
 */

import { ContractConfirmWizardContainers } from '../enum/contract-confirm-containers.enum';
import { IConHeaderEntity, IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { RfqBidderProjectDocument } from '../../rfq-bidder/types/rfq-bidder-project-document.type';
import { IGenericWizardReportEntity } from '../../rfq-bidder/types/generic-wizard-report-entity.interface';
import { RfqBidders } from '../../rfq-bidder/types/rfq-bidders.type';

/**
 * Types of all the containers available in contract confirm wizard.
 */
export type ContractConfirmWizardUuidTypeMap = {
    [ContractConfirmWizardContainers.CON_LIST]: IConHeaderEntity;
    [ContractConfirmWizardContainers.CON_DETAIL]: IConHeaderEntity;
    [ContractConfirmWizardContainers.CON_BUSINESSPARTNER]: RfqBidders;
    [ContractConfirmWizardContainers.CONTRACT_CONFIRM_PROJECT_DOCUMENT]: RfqBidderProjectDocument;
    [ContractConfirmWizardContainers.CONTRACT_CONFIRM_DOCUMENT]: RfqBidderProjectDocument;
    [ContractConfirmWizardContainers.CONTRACT_PRC_BOQ]: IPrcBoqExtendedEntity;
    [ContractConfirmWizardContainers.CONTRACT_CONFIRM_REPORT]: IGenericWizardReportEntity;
    [ContractConfirmWizardContainers.CONTRACT_CONFIRM_COVER_LETTER]: IGenericWizardReportEntity,

}