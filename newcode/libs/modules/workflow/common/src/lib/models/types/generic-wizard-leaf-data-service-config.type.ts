/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { LazyInjectionToken, PlatformLazyInjectorService } from '@libs/platform/common';
import { DataServiceBase, IDataServiceEndPointOptions, IEntitySelection, IParentRole } from '@libs/platform/data-access';

/**
 * Configuration used to create leaf data service for generic wizard.
 */
export type GenericWizardLeafDataServiceConfig<T extends object, PT extends object, PU extends object> = GenericWizardRootDataServiceConfig<T> & {
	parentService: (IParentRole<PT, PU> & IEntitySelection<PT>) | LazyInjectionToken<IParentRole<PT, PU> & IEntitySelection<PT>> | DataServiceBase<PT>
}

/**
 * Configuration used to create root data service for generic wizard.
 */
export type GenericWizardRootDataServiceConfig<T extends object> = {
	/**
	 * Base url used to load data from service.
	 */
	apiUrl: string,

	/**
	 * Configuration for loading root service.
	 */
	readInfo: IDataServiceEndPointOptions & { params?: Record<string, string> },

	/**
	 * Optional function to access loaded items to update them to required structure.
	 * @param loadedItems 
	 * @returns 
	 */
	onLoadSucceeded?: (loadedItems: object, injector: Injector, lazyinjector: PlatformLazyInjectorService) => T[] | Promise<T[]>
}