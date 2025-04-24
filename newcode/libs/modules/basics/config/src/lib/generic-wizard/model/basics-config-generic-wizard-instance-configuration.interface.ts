/*
 * Copyright(c) RIB Software GmbH
 */

import { IGenericWizardStepConfiguration } from './basics-config-generic-wizard-step-configuration.interface';
import { IGenericWizardInstanceEntity } from './entities/generic-wizard-instance-entity.interface';

/**
 * Generic wizard instance configuration interface.
 */
export interface IGenericWizardInstanceConfiguration {
	/**
	 * Configuration for the generic wizard instance.
	 */
	Instance: IGenericWizardInstanceEntity,

	/**
	 * All the steps available in the generic wizard configuration.
	 */
	Steps: IGenericWizardStepConfiguration[],

	//TODO: add type for parameters.
	/**
	 * Parameters to be included in the generic wizard.
	 */
	Parameter: []
}