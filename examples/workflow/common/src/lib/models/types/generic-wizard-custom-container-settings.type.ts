/*
 * Copyright(c) RIB Software GmbH
 */

import { CustomContainerConfiguration } from '../types/generic-wizard-container-config.type';
import { GenericWizardContainers } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { CustomContainerUnion } from '../types/generic-wizard-container.type';
import { DataServiceBase, IEntitySelection } from '@libs/platform/data-access';
import { GenericWizardRootEntities } from '../../configuration/base/class/generic-wizard-id-use-case-map';

/**
 * Settings used to build entity info for custom container.
 */
export type CustomContainerSettings<T extends object> = {
	/**
	 * The container configuration.
	 */
	container: CustomContainerUnion;

	/**
	 * The root data service of the container configuration.
	 */
	rootDataService: DataServiceBase<GenericWizardRootEntities>;

	/**
	 * A cache of all data services.
	 * The data service for the current container will be stored here.
	 */
	dataServiceCache: Record<GenericWizardContainers, IEntitySelection<T>>;

	/**
	 * The uuid of the current container.
	 */
	containerUuid: GenericWizardContainers;

	/**
	 * The custom container configuration.
	 */
	customContainerConfiguration: CustomContainerConfiguration<T>;

	/**
	 * Selects all the items in this container.
	 * @Default is false by default.
	 */
	includeAll: boolean;
}