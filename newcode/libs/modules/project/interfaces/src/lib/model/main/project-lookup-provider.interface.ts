/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ILookupFieldOverload, ILookupOptions } from '@libs/ui/common';
import { IProjectEntity } from '../../model/entities/main';

/**
 * Project lookup options interface
 */
export interface IProjectLookupOptions<T extends object> {
	lookupOptions?: Partial<ILookupOptions<IProjectEntity, T>>;
}

/**
 * Provides project-related lookups.
 */
export interface IProjectLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick a project.
	 */
	generateProjectLookup<T extends object>(options?: IProjectLookupOptions<T>): ILookupFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates project lookup field overloads.
 */
//The token is deprecated. Please avoid using it for new development. Instead, use the PROJECT_MAIN_LOOKUP_PROVIDER_TOKEN, which follows the new approach outlined in DEV-20002.
export const PROJECT_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IProjectLookupProvider>('project.shared.ProjectLookupProvider');
