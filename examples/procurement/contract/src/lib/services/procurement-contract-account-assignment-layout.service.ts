/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, ProviderToken } from '@angular/core';
import { ProcurementCommonAccountAssignmentDataService, ProcurementCommonAccountAssignmentLayoutService } from '@libs/procurement/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { mergeLayout } from '@libs/basics/shared';
import { IConAccountAssignmentEntity } from '../model/entities/con-account-assignment-entity.interface';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementCommonContractCrewLookupService } from '../lookups/contract-crew-lookup.service';

@Injectable({
	providedIn: 'root',
})

/**
 * AccountAssignment data service
 */
export class ProcurementContractAccountAssignmentLayoutService extends ProcurementCommonAccountAssignmentLayoutService<IConAccountAssignmentEntity, IConHeaderEntity, ContractComplete> {

	public override async generateLayout(config: {
		dataServiceToken: ProviderToken<ProcurementCommonAccountAssignmentDataService<IConAccountAssignmentEntity, IConHeaderEntity, ContractComplete>>
	}): Promise<ILayoutConfiguration<IConAccountAssignmentEntity>> {
		return mergeLayout(await super.generateLayout(config), {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PsdScheduleFk', 'PsdActivityFk', 'ConCrewFk']
				}
			],
			labels: {
				...prefixAllTranslationKeys('procurement.contract.', {
					PsdScheduleFk: {key: 'EntityPsdScheduleFk'},
					PsdActivityFk: {key: 'EntityPsdActivityFk'},
					ConCrewFk: {key: 'EntityConCrewFk'}
				})
			},
			overloads: {
				//TODO: schedule lookup is not working currently need to filter according to the current project
				/*PsdScheduleFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: SchedulingScheduleLookup,
						displayMember: 'Code',
						showClearButton: true,
					}),
				},*/
				//TODO: schedule activity lookup is not working currently need to filter according to the current schedule
				/*PsdActivityFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: SchedulingActivityLookupService,
						showClearButton: true,
					}),
				},*/
				ConCrewFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementCommonContractCrewLookupService,
						showClearButton: true,
					}),
				},
			}
		});
	}
}
