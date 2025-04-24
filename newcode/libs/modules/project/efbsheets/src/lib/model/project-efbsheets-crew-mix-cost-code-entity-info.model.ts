/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IPrjCrewMix2CostCodeEntity } from './prj-crew-mix-2cost-code-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { EstimateShareCostCodesLookupService } from '@libs/estimate/shared';
import { ProjectEfbsheetsCrewMixCostCodeDataService } from '../services/project-efbsheets-crew-mix-cost-code-data.service';
export const PROJECT_EFBSHEETS_CREW_MIX_COST_CODE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPrjCrewMix2CostCodeEntity>({
	grid: {
		title: { key: 'project.main.crewMixToCostCodes' },
	},
	form: {
		title: { key: 'basics.clerk' + '.project.main.crewMixToCostCodesDetails' },
		containerUuid: '4e0ba68eb6a94cd7bcada61f767c9fae',
	},
	dataService: (ctx) => ctx.injector.get(ProjectEfbsheetsCrewMixCostCodeDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.EfbSheets', typeName: 'PrjCrewMix2CostCodeDto' },
	permissionUuid: '5fbf701267ea4e20b4723a7d46dbee24',

	layoutConfiguration: {
		groups: [{ gid: 'baseGroup', attributes: ['MdcCostCodeFk'] }],
		overloads: {
			MdcCostCodeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: EstimateShareCostCodesLookupService
				})
			}
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				MdcCostCodeFk: { key: 'entityCostCode' },
			})
		}
	}
});
