/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectable } from '@libs/platform/common';
import { ILineItemHeaderEntity, ISchedulingProgressReportLineItemHeaderLookupOptions, ISchedulingProgressReportLineItemHeaderLookupProvider, PROGRESS_REPORT_LINE_ITEM_HEADER_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { SchedulingProgressReportLineitemHeaderLookup } from '@libs/scheduling/shared';


/**
 * Provides scheduling main estLineItemHeader lookups.
 */
@LazyInjectable({
	token: PROGRESS_REPORT_LINE_ITEM_HEADER_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class SchedulingProgressReportLineItemHeaderLookupProvider implements ISchedulingProgressReportLineItemHeaderLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an estLineItemHeader lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateProgressReportLineItemHeaderLookup<T extends object>(options?: ISchedulingProgressReportLineItemHeaderLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, ILineItemHeaderEntity>({
				dataServiceToken: SchedulingProgressReportLineitemHeaderLookup,
			}),
			readonly: options?.readonly ?? false
		};
	}
}
