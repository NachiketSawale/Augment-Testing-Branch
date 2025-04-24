/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import { CHECKLIST_TEMPLATE_LOOKUP_PROVIDER_TOKEN, IChecklistTemplateLookupProvider } from '@libs/hsqe/interfaces';
import { LazyInjectable } from '@libs/platform/common';
import { HsqeChecklistTemplateLookupService } from './hsqe-checklist-template-lookup.service';
import { IHsqChkListTemplateEntity } from '@libs/hsqe/interfaces';

@LazyInjectable({
	token: CHECKLIST_TEMPLATE_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true,
})
/**
 * A service that provides lookups related to checklist template
 */
@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistTemplateLookupProviderService implements IChecklistTemplateLookupProvider {
	/**
	 * Provides a field/overload definition for checklist template lookup.
	 *
	 * @typeParam T The type of the referencing entity.
	 *
	 * @returns The field/overload definition.
	 */
	public generateChecklistTemplateLookup<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IHsqChkListTemplateEntity>({
				showClearButton: !!options?.showClearButton,
				dataServiceToken: HsqeChecklistTemplateLookupService,
			}),
		};
	}
}
