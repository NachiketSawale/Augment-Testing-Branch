/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { GenericWizardEntityConfig } from '@libs/ui/business-base';
import { GenericWizardContainers, GenericWizardUuidTypeMap } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { TransientFieldSpec } from '@libs/ui/common';

/**
 * Configuration for entity type containers in the generic wizard.
 */
export type GenericWizardEntityContainerConfiguration<Key extends GenericWizardContainers> = {

	/**
	 * Used to load the respective entity information.
	 */
	entityInfo: LazyInjectionToken<GenericWizardEntityConfig<GenericWizardUuidTypeMap[Key]>>;

	/**
	 * Additional fields to be included in the entity configuration.
	 */
	transientFields?: TransientFieldSpec<GenericWizardUuidTypeMap[Key]>[];
}