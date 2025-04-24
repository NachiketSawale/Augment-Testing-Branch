/*
 * Copyright(c) RIB Software GmbH
 */

import { IGenericWizardContainerEntity } from './basics-config-generic-wizard-container-entity.interface';
import { IGenericWizardProperties } from './basics-config-generic-wizard-properties.interface';

/**
 * All data needed for an container of a generic wizard step
 */
export interface IGenericWizardContainerConfiguration {
	/**
	 * Data of the container itself.
	 */
	Instance: IGenericWizardContainerEntity;

	/**
	 * Properties that should be loaded in the container.
	 */
	Properties: IGenericWizardProperties[];
}