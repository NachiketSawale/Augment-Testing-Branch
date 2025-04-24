/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for timekeeping employee certification lookup.
 */
export interface ITimekeepingEmployeeCertificationLookupOptions {

}

/**
 * Provides crew leader lookups.
 */
export interface ITimekeepingEmployeeCertificationLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an employee certification.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateEmployeeCertificationLookup<T extends object>(options?: ITimekeepingEmployeeCertificationLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates employee certification lookup field overloads.
 */
export const EMPLOYEE_CERTIFICATION_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ITimekeepingEmployeeCertificationLookupProvider>('timekeeping.employee.TimekeepingEmployeeCertificationLookupProvider');
