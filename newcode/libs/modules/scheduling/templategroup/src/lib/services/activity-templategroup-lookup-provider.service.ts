/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	createLookup,
	FieldType,
	TypedConcreteFieldOverload
} from '@libs/ui/common';
import { IActivityTemplateGroupLookupOptions, IActivityTemplateGroupLookupProvider } from '@libs/scheduling/interfaces';
import { ISchedulingTemplateGroupTree, SchedulingTemplategroupTreeLookup } from '@libs/scheduling/shared';

/**
 * Provides activity template related lookups.
 */
// @LazyInjectable({
// 	token: ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN,
// 	useAngularInjection: true
// })
@Injectable({
	providedIn: 'root'
})
export class ActivityTemplateGroupLookupProviderService implements IActivityTemplateGroupLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a activity template.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */

	public generateActivityTemplateGroupLookup<T extends object>(options?: IActivityTemplateGroupLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, ISchedulingTemplateGroupTree>({
				dataServiceToken: SchedulingTemplategroupTreeLookup
			})
		};
	}
}
