/*
 * Copyright(c) RIB Software GmbH
 */

import { GenericWizardEntityConfig } from '@libs/ui/business-base';
import { GenericWizardRootEntities } from '../../configuration/base/class/generic-wizard-id-use-case-map';
import { DataServiceBase, IEntityList, IEntitySelection } from '@libs/platform/data-access';
import { GenericWizardContainers } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { EntityContainerUnion } from '../types/generic-wizard-container.type';

/**
 * Settings used to build entity info for entity info container.
 */
export type EntityInfoContainerSettings<T extends object> = {
	/**
	 * The container configuration.
	 */
	container: EntityContainerUnion;

	/**
	 * The root data service of the container configuration.
	 */
	rootDataService: RootDataService;

	/**
	 * A cache of all data services.
	 * The data service for the current container will be stored here.
	 */
	dataServiceCache: Record<GenericWizardContainers, IEntitySelection<T>>;

	/**
	 * The loaded entity info of the container.
	 */
	entityInfo?: GenericWizardEntityConfig<T>;

	/**
	 * Uuid of the current container.
	 */
	containerUuid: GenericWizardContainers;
}

/**
 * Root dataservice used to load or set items in the generic wizard.
 */
export type RootDataService = DataServiceBase<GenericWizardRootEntities> & IEntitySelection<GenericWizardRootEntities> & IEntityList<GenericWizardRootEntities>;