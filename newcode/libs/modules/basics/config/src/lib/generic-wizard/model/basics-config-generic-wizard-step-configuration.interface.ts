/*
 * Copyright(c) RIB Software GmbH
 */

import { IGenericWizardStepScriptEntity } from '../../generic-wizard-script/model/entities/generic-wizard-step-script-entity.interface';
import { IGenericWizardContainerConfiguration } from './basics-config-generic-wizard-container-configuration.interface';
import { IGenericWizardInstanceEntity } from './entities/generic-wizard-instance-entity.interface';

/**
 * All data needed for a generic wizard step
 */
export interface IGenericWizardStepConfiguration {

	/**
	 * The step data itself
	 */
	Instance: IGenericWizardInstanceEntity,

	/**
	 * Data of sub ordinated steps - only filled if it is a sequence, recursion
	 */
	Substeps: IGenericWizardStepConfiguration[],

	/**
	 * Entire layout information (and more) for all container needed by the step
	 */
	Container: IGenericWizardContainerConfiguration[],

	/**
	 * Entire layout information (and more) for all container needed by the step
	 */
	Scripts: IGenericWizardStepScriptEntity
}