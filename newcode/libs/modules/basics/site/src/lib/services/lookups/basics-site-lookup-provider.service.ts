/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { BASICS_SITE_LOOKUP_PROVIDER_TOKEN, IBasicsCustomizeSiteEntity, IBasicsSiteLookupProvider } from '@libs/basics/interfaces';
import { createLookup, FieldType, ILookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';
import { BasicsSharedSiteLookupService } from '@libs/basics/shared';

@LazyInjectable({
	token: BASICS_SITE_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true,
})
@Injectable({
	providedIn: 'root',
})
export class BasicsSiteLookupProviderService implements IBasicsSiteLookupProvider {
	public provideSiteLookupOverload<T extends object>(options?: ILookupOptions<IBasicsCustomizeSiteEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedSiteLookupService,
				...options,
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Description',
					label: {
						text: 'Site Description',
						key: 'basics.site.entityDesc',
					},
					column: true,
					singleRow: true,
				},
			],
		};
	}
}
