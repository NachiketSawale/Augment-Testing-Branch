/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupContext, TypedConcreteFieldOverload } from '@libs/ui/common';
import { HsqeChecklistLookupService } from './hsqe-checklist-lookup.service';
import { CHECKLIST_LOOKUP_PROVIDER_TOKEN, IChecklistLookupOptions, IChecklistLookupProvider, IHsqCheckListEntity, RestrictToProjectIds } from '@libs/hsqe/interfaces';
import { LazyInjectable } from '@libs/platform/common';

@LazyInjectable({
	token: CHECKLIST_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true,
})
/**
 * A service that provides lookups related to checklist
 */
@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistLookupProviderService implements IChecklistLookupProvider {
	/**
	 * Provides a field/overload definition for checklist  lookup.
	 *
	 * @typeParam T The type of the referencing entity.
	 *
	 * @returns The field/overload definition.
	 */
	public generateChecklistLookup<T extends object>(options?: IChecklistLookupOptions<T>): TypedConcreteFieldOverload<T> {
		return {
			readonly: !!options?.readonly,
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IHsqCheckListEntity>({
				showClearButton: !!options?.showClearButton,
				serverSideFilter: getServerSideFilter(options),
				dataServiceToken: HsqeChecklistLookupService,
			}),
		};

		function getServerSideFilter(options?: IChecklistLookupOptions<T>) {
			if (options === undefined || (options.restrictToProjectIds === undefined && options.customServerSideFilter === undefined)) {
				return {
					key: '',
					execute: () => 'true', // return all.
				};
			}
			/// project id filters
			const restrictToProjectIds = options.restrictToProjectIds;
			if (restrictToProjectIds) {
				return {
					key: '',
					execute: (context: ILookupContext<IHsqCheckListEntity, T>) => {
						const referencedItem = context.entity;
						return prepareFilterValue(restrictToProjectIds, referencedItem);
					},
				};
			}
			/// custom server side filter
			return options.customServerSideFilter;
		}

		function prepareFilterValue(restrictToProjectIds: RestrictToProjectIds<T>, referencedItem?: T) {
			const projectIds = collectProjectIds(restrictToProjectIds, referencedItem);
			if (projectIds.length === 0) {
				return 'true'; // return all
			}
			const filterParts = projectIds.map((id) => `PrjProjectFk = ${id}`);
			return filterParts.join(' or ');
		}

		/**
		 * collect project id into array
		 * @param restrictToProjectIds
		 * @param item
		 */
		function collectProjectIds(restrictToProjectIds: RestrictToProjectIds<T>, item?: T): number[] {
			let ids: number[] = [];

			const addToIds = (value: number | number[] | undefined | null) => {
				if (Array.isArray(value)) {
					ids = [...ids, ...value];
				} else if (typeof value === 'number') {
					ids.push(value);
				}
			};

			if (typeof restrictToProjectIds === 'function') {
				// function case
				if (item) {
					addToIds(restrictToProjectIds(item));
				}
			} else {
				// number,array,undefined case
				addToIds(restrictToProjectIds);
			}
			return ids;
		}
	}
}
