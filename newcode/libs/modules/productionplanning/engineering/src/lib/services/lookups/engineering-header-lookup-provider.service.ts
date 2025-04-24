import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { ENGINEERING_HEADER_LOOKUP_PROVIDER_TOKEN, IEngineeringHeaderLookupProvider } from '@libs/productionplanning/shared';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { PpsEngineeringHeaderDialogLookupService } from './pps-engineering-header-dialog-lookup.service';

@LazyInjectable({
	token: ENGINEERING_HEADER_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class EngineeringHeaderLookupProviderService   implements IEngineeringHeaderLookupProvider {
	public provideLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: PpsEngineeringHeaderDialogLookupService,
			}),
		};
	}
}