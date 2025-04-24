/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectable } from '@libs/platform/common';
import { ITimekeepingTimeSymbolLookupOptions, ITimekeepingTimeSymbolLookupProvider, ITimeSymbolEntity, TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeSymbolLookupService } from '@libs/timekeeping/shared';


/**
 * Provides timekeeping time symbol lookups.
 */
@LazyInjectable({
	token: TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeSymbolLookupProvider implements ITimekeepingTimeSymbolLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a time symbol lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateTimeSymbolLookup<T extends object>(options: ITimekeepingTimeSymbolLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, ITimeSymbolEntity>({
				dataServiceToken: TimekeepingTimeSymbolLookupService
			}),
			additionalFields:[
				{
					displayMember: 'DescriptionInfo',
					label: {
						key: options.preloadTranslation + 'TimeSymbolDescription',
					},
					column: true,
					singleRow: true
				},
				{
					displayMember: 'TimeSymbolGroup.DescriptionInfo',
					label: {
						key: options.preloadTranslation + 'TimeSymbolTimeSymbolGroupFk',
					},
					column: true,
					singleRow: true
				},
				{
					//TODO get the DescriptionInfo from the lookup of UoMFk
					displayMember: 'UoMFk',
					label: {
						key: options.preloadTranslation + 'TimeSymbolUomFk',
					},
					column: true,
					singleRow: true
				}
			],
			readonly: options.readonly ? options.readonly : false
		};
	}
}
