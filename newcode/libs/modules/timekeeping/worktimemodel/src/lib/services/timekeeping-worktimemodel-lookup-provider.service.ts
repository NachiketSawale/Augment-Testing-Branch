/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, TypedConcreteFieldOverload } from '@libs/ui/common';
import { LazyInjectable } from '@libs/platform/common';
import { ITimekeepingWorkTimeModelLookupOptions, ITimekeepingWorkTimeModelFbLookupProvider, WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';
import { IWorkTimeModelEntity } from '../model/entities/work-time-model-entity.interface';
import { TimekeepingWorktimemodelFblookupDataService } from './lookup/timekeeping-worktimemodel-fblookup-data.service';
import { TimekeepingWorktimemodellookupDataService } from './lookup/timekeeping-worktimemodel-lookup-data.service';


/**
 * Provides timekeeping work time model lookups.
 */
@LazyInjectable({
	token: WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class TimekeepingWorkTimeModelFbLookupProvider implements ITimekeepingWorkTimeModelFbLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a work time model lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateWorkTimeModelLookup<T extends object>(options?: ITimekeepingWorkTimeModelLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IWorkTimeModelEntity>({
				dataServiceToken: options?.IsFallback ? TimekeepingWorktimemodelFblookupDataService: TimekeepingWorktimemodellookupDataService,
				showGrid: true,
				gridConfig: {
					columns: [{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true
					}]
				}
			})
		};
	}
}
