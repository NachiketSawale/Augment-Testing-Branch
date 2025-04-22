/*
 * Copyright(c) RIB Software GmbH
 */

import { IGenericWizardInstanceEntity } from '@libs/basics/config';
import { IWorkflowActionTask } from '@libs/workflow/interfaces';

/**
 * Represents the configuration of the items stored in the generic wizard service.
 */
export type GenericWizardBaseConfig = {
	startEntityId: number;
	followTemplateId: number;
    actionInstance: IWorkflowActionTask;
	instance: IGenericWizardInstanceEntity;
	communicationChannel: number;
};