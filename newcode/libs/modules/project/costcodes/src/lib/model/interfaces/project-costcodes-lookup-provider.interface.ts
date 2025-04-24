import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';



/**
 * Provides project  cost code lookup
 */
export interface IProjectCodesLookupProvider {


	/**
	 * Generates a lookup field
	 *
	 * @returns The lookup field overload.
	 */
    provideProjectCostcodesControllingLookupOverload<T extends object>(options?: ICommonLookupOptions ): TypedConcreteFieldOverload<T>;
    provideProjectCostcodesCostTypeLookupOverload<T extends object>(options?: ICommonLookupOptions ): TypedConcreteFieldOverload<T>;

}

/**
 * A lazy injection to retrieve lookup field for project cost codes.
 */
export const PROJECT_COSTCODES_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IProjectCodesLookupProvider>('project.costcodes.lookupProvider');
