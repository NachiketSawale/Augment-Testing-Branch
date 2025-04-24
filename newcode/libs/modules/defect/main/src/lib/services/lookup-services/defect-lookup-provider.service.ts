/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupContext, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectable } from '@libs/platform/common';
import { DEFECT_LOOKUP_PROVIDER_TOKEN, IDefectLookupOptions, IDefectProvider, IDfmDefectEntity, RestrictToProjectId } from '@libs/defect/interfaces';
import { DfmDefectLookupService } from './defect-lookup.service';

@LazyInjectable({
	token: DEFECT_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true,
})
/**
 * A service that provides lookups related to defect
 */
@Injectable({
	providedIn: 'root',
})
export class DefectLookupProviderService implements IDefectProvider {
	/**
	 * Provides a field/overload definition for defect  lookup.
	 *
	 * @typeParam T The type of the referencing entity.
	 *
	 * @returns The field/overload definition.
	 */
	public generateDefectLookup<T extends object>(options?: IDefectLookupOptions<T>): TypedConcreteFieldOverload<T> {
		return {
			readonly: !!options?.readonly,
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IDfmDefectEntity>({
				showClearButton: !!options?.showClearButton,
				serverSideFilter: getServerSideFilter(options),
				dataServiceToken: DfmDefectLookupService,
			}),
		};

		function getServerSideFilter(options?: IDefectLookupOptions<T>) {
			const defectFilterKey = 'defect-header-filter';
			if (options === undefined || (options.restrictToProjectId === undefined && options.customServerSideFilter === undefined)) {
				return {
					key: defectFilterKey,
					execute: () => 'true', // return all.
				};
			}
			/// project id filters
			const restrictToProjectId = options.restrictToProjectId;
			if (restrictToProjectId) {
				return {
					key: defectFilterKey,
					execute: (context: ILookupContext<IDfmDefectEntity, T>) => {
						const referencingItem = context.entity;
						return {
							ProjectFk: getProjectId(restrictToProjectId, referencingItem),
						};
					},
				};
			}
			/// custom server side filter
			return options.customServerSideFilter;
		}

		/**
		 * get project id
		 * @param restrictToProjectId
		 * @param item
		 */
		function getProjectId(restrictToProjectId: RestrictToProjectId<T>, item?: T): number | null {
			let id: number | null = null;
			if (typeof restrictToProjectId === 'function' && item) {
				const value = restrictToProjectId(item);
				return typeof value === 'number' ? value : null;
			} else if (typeof restrictToProjectId === 'number') {
				id = restrictToProjectId;
			}
			return id;
		}
	}
}
