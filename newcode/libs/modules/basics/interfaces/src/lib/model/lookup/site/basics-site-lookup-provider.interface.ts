/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectionToken } from '@libs/platform/common';
import { IBasicsCustomizeSiteEntity } from '../../entities/customize';

export interface IBasicsSiteLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick a basics site.
	 *
	 * @returns The lookup field overload.
	 */
	provideSiteLookupOverload<T extends object>(options?: ILookupOptions<IBasicsCustomizeSiteEntity, T>): TypedConcreteFieldOverload<T>;
}

export const BASICS_SITE_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IBasicsSiteLookupProvider>('basics.site.lookupProvider');
