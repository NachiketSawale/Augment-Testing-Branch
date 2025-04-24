import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';



/**
 * Provides estimate main lookup
 */
export interface IEstimateMainLookupProvider {


	/**
	 * Generates a lookup field
	 *
	 * @returns The lookup field overload.
	 */
    provideEstimateMainHeaderLookupLookupOverload<T extends object>(options?: ICommonLookupOptions ): TypedConcreteFieldOverload<T>;
  

}

/**
 * A lazy injection to retrieve lookup field for estimate .
 */
export const ESTIMATE_MAIN_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IEstimateMainLookupProvider>('estimate.main.estimatePojectLookupProvider');
