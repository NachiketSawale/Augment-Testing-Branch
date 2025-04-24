/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcCommonTotalEntity, IQuote2RfqVEntity, IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ContractApprovalContainers } from '../enum/contract-approval-containers.enum';
import { IBusinessPartnerEntity, ICertificateEntity } from '@libs/businesspartner/interfaces';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { IWorkflowApprover } from '@libs/workflow/interfaces';
import { ICommentEntity } from '@libs/basics/shared';
import { IPrcGeneralsEntity } from '@libs/procurement/common';
import { IBoqItemEntity } from '@libs/boq/interfaces';

/**
 * Types of all the containers available in contract confirm wizard.
 */
export type ContractApprovalmWizardUuidTypeMap = {
    [ContractApprovalContainers.BUSINESSPARTNER_LIST]: IBusinessPartnerEntity;
    [ContractApprovalContainers.BUSINESSPARTNER_DETAIL]: IBusinessPartnerEntity;
    [ContractApprovalContainers.RFQ_LIST]: IRfqHeaderEntity;
    [ContractApprovalContainers.QUOTE]: IQuote2RfqVEntity;
    [ContractApprovalContainers.CERTIFICATES]: IPrcCertificateEntity;
    [ContractApprovalContainers.ACTUAL_CERTIFICATES]: ICertificateEntity;
    [ContractApprovalContainers.CONTRACT_APPROVER]: IWorkflowApprover;
    [ContractApprovalContainers.APPROVER]: IWorkflowApprover
    [ContractApprovalContainers.PINBOARD_COMMENTS]: ICommentEntity;
    [ContractApprovalContainers.TOTALS]: IPrcCommonTotalEntity;
    [ContractApprovalContainers.BOQ_STRUCTURE]: IBoqItemEntity;
    [ContractApprovalContainers.GENERALS]: IPrcGeneralsEntity,
    [ContractApprovalContainers.BP_RELATION_CHART]: IBusinessPartnerEntity;

}