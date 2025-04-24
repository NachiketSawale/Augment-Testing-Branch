/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';

/**
 * Provides model-related lookups.
 */
export interface IChecklistTemplateLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick checklist template.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateChecklistTemplateLookup<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates checklist template lookup field overloads.
 */
export const CHECKLIST_TEMPLATE_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IChecklistTemplateLookupProvider>('hsqe.checklisttemplate.ChecklistLookupProvider');
