/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectable } from '@libs/platform/common';
import { EMPLOYEE_CERTIFICATION_LOOKUP_PROVIDER_TOKEN, ITimekeepingEmployeeCertificationLookupOptions, ITimekeepingEmployeeCertificationLookupProvider } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeCertificateLookupService } from '@libs/timekeeping/shared';


/**
 * Provides timekeeping employee certification lookups.
 */
@LazyInjectable({
	token: EMPLOYEE_CERTIFICATION_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class TimekeepingEmployeeCertificationLookupProvider implements ITimekeepingEmployeeCertificationLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an employee certification lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateEmployeeCertificationLookup<T extends object>(options?: ITimekeepingEmployeeCertificationLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: TimekeepingEmployeeCertificateLookupService
			})
		};
	}
}
