/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { ContainerDefinition } from '@libs/ui/container-system';
import { GenericWizardContainers } from '../../configuration/base/enum/rfq-bidder-container-id.enum';

/**
 * Container and title in each step in the generic wizard.
 */
export type ContainerConfiguration = {
	/**
	 * The container to be shown in each step.
	 */
	container: ContainerDefinition[];

	/**
	 * The title of the container.
	 */
	containerTitle: Translatable;

	/**
	 *	The uuid of the container.
	 */
	containerUuid: GenericWizardContainers;

	/**
	 * Used to determine if the items from this container should be included in infobar.
	 */
	isIncludedInInfoBar: boolean;
}

/**
 * Containers and tab name for each step in the generic wizard.
 */
export type GenericWizardStepConfig = {
	/**
	 * Configuration for a list of containers available in the step.
	 */
	containerConfig: ContainerConfiguration[];

	/**
	 * The tab name for the step.
	 */
	tabName: Translatable;
}


/**
 *  ReportContainerInput : To load the container list and
 */
export type ReportContainerInput = {
	moduleName: string;
	containerUuid: GenericWizardContainers;
}

/**
 * Represents the entity info passed to the generic wizard component.
 */
export const GENERIC_WIZARD_STEPS_TOKEN = new InjectionToken<GenericWizardStepConfig[]>('generic-wizard-injection-token');
