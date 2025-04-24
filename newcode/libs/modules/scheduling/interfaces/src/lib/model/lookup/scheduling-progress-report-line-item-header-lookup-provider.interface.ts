/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Options for scheduling estLineItemHeader lookup.
 */
export interface ISchedulingProgressReportLineItemHeaderLookupOptions {
	readonly?: boolean;
}

/**
 * Provides estLineItemHeader lookups.
 */
export interface ISchedulingProgressReportLineItemHeaderLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an estLineItemHeader.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateProgressReportLineItemHeaderLookup<T extends object>(options?: ISchedulingProgressReportLineItemHeaderLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates estLineItemHeader lookup field overloads.
 */
export const PROGRESS_REPORT_LINE_ITEM_HEADER_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<ISchedulingProgressReportLineItemHeaderLookupProvider>('scheduling.main.SchedulingProgressReportLineItemHeaderLookupProviderService');
