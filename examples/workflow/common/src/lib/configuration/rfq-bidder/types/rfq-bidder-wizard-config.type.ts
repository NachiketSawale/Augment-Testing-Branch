/*
 * Copyright(c) RIB Software GmbH
 */

import { GenericWizardBaseConfig } from '../../../models/types/generic-wizard-base-config.type';
import { PrcInfoForGenericWizard } from '../../../models/types/prc-info-for-generic-wizard.type';
import { RfqWizardProject } from './generic-wizard-project.type';

export type RfqBidderWizardConfig = GenericWizardBaseConfig & {
    subject: string;
	defaultSubject: string;
	communicationChannel: number;
	hasReqVariantAssigned: boolean;
	startingClerk: { Id: number, Description: string, Email: string };
    prcInfo: PrcInfoForGenericWizard;
    project: RfqWizardProject;
    namingParameter: { NamingType: number, Pattern: string }[];
}