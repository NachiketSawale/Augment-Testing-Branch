
import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';

export interface IEngineeringHeaderLookupProvider {
	/**
	* Generates a lookup field overload definition to pick a engineering header.
	*
	* @param options The options to apply to the lookup
	*
	* @returns The lookup field overload.
	*/
	provideLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
	
	// /**
	// * Generates a lookup field overload definition to read a engineering header.
	// *
	// * @returns The lookup field overload.
	// */
	// provideReadonlyLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;

}

export const ENGINEERING_HEADER_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IEngineeringHeaderLookupProvider>('productionplanning.engineering.engineering-header-lookup-provider');