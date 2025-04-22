/*
 * Copyright(c) RIB Software GmbH
 */

import { GenericWizardBaseConfig } from '../../../models/types/generic-wizard-base-config.type';
import { PrcInfoForGenericWizard } from '../../../models/types/prc-info-for-generic-wizard.type';

export type ContractConfirmWizardConfig = GenericWizardBaseConfig & {
    subject: string;
    defaultSubject: string;
    prcInfo: PrcInfoForGenericWizard;
    startingClerk: { Id: number, Description: string, Email: string };
    namingParameter: { NamingType: number, Pattern: string }[];
    project: { ProjectName: string, ProjectNo: number };
}