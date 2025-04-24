/*
 * Copyright(c) RIB Software GmbH
 */


import {  ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectionToken } from '@libs/platform/common';


export interface ILogisticSundryServiceLookupProvider {

	 provideLogisticSundryServiceLookupOverload<T extends object>( options?: ICommonLookupOptions) : TypedConcreteFieldOverload<T>

}
export const LOGISTIC_SUNDRY_SERVICE_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ILogisticSundryServiceLookupProvider>('logistic.sundryService.LookupProvider');