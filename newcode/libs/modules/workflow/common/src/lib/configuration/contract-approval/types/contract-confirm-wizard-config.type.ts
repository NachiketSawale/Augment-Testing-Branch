/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowApproverConfigEntity } from '@libs/workflow/shared';
import { GenericWizardBaseConfig } from '../../../models/types/generic-wizard-base-config.type';
import { IPrcConfigurationEntity } from '@libs/basics/procurementconfiguration';
import { IConHeaderApprovalEntity } from '@libs/procurement/interfaces';

export type ContractApprovalWizardConfig = GenericWizardBaseConfig & {
    approvalPossible: boolean;
    ApprovalConfigurationForUser: IWorkflowApproverConfigEntity;
    procurementConfig: IPrcConfigurationEntity;
    ContractRejectionConfigurationForUser: IConHeaderApprovalEntity
}