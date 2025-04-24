/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';



/**
 * Provides basic cost code lookup
 */
export interface IBasicsCostCodeLookupProvider{

	/**
	 * Generates a lookup field
	 *
	 * @returns The lookup field overload.
	 */
	GenerateBasicsCostCodeLookup<T extends object>(readonly?: boolean): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve lookup field for basic cost codes.
 */
export const BASICS_COST_CODES_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IBasicsCostCodeLookupProvider>('basics.costcodes.basicCostCodeLookupProvider');
