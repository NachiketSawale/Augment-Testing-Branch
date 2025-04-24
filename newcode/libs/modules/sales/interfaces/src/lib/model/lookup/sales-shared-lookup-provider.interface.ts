import { ConcreteFieldOverload, IAdditionalLookupOptions } from '@libs/ui/common';
import { LazyInjectionToken } from '@libs/platform/common';

export interface ISalesSharedLookupOptions {
	showClearBtn?: boolean;
	readOnly?: boolean;
}

export interface ISalesSharedLookupProvider {
	provideTaxCodeLookupOverload<T extends object>(options?: ISalesSharedLookupOptions):  ConcreteFieldOverload<T> | IAdditionalLookupOptions<T>;
	provideControllingUnitLookupOverload<T extends object>(options?: ISalesSharedLookupOptions): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T>;
	provideGeneralTypeLookupOverload<T extends object>(options?: ISalesSharedLookupOptions): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T>;
	provideOrdHeaderLookupOverload<T extends object>(options?: ISalesSharedLookupOptions): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T>;
}

export const SALES_SHARED_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ISalesSharedLookupProvider>('sales.shared.SalesSharedCustomizeLookupOverloadProvider');
