/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken, Translatable } from '@libs/platform/common';
import { GenericWizardRootEntityConfig } from '@libs/ui/business-base';
import { ConfigProvider } from './generic-wizard-config-provider.type';
import { GenWizardButton } from './generic-wizard-buttons.type';
import { Containers } from './generic-wizard-container.type';
import { GenericWizardUseCaseUuid } from '../enum/generic-wizard-use-case-uuid.enum';

/**
 * Represents the generic wizard use case configuration.
 */
export type GenericWizardUseCaseConfig<RootType extends object, Key extends GenericWizardUseCaseUuid> = {

	/**
	 * Title used for the generic wizard.
	 */
	WizardTitle: Translatable

	/**
	 * Root data service used for the generic wizard.
	 */
	RootDataService: LazyInjectionToken<GenericWizardRootEntityConfig<RootType>>,

	/**
	 * Configuration providers used for the generic wizard.
	 */
	ConfigProviders: ConfigProvider<Key>[],

	/**
	 * Container configurations used for the generic wizard.
	 */
	Containers: Containers,

	/**
	 * Buttons used for the generic wizard.
	 */
	WizardButtons: GenWizardButton[],
};