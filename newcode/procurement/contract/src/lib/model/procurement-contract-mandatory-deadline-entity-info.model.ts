/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcMandatoryDeadlineEntity } from '@libs/procurement/common';

import { ProcurementContractMandatoryDeadlineDataService } from '../services/procurement-contract-mandatory-deadline-data.service';
import { ProcurementContractMandatoryDeadlineBehavior } from '../behaviors/procurement-contract-mandatory-deadline-behavior.service';

/**
 * Procurement contract mandatory deadline entity info
 */
export const PROCUREMENT_CONTRACT_MANDATORY_DEADLINE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPrcMandatoryDeadlineEntity>({
	grid: {
		title: { key: 'procurement.common.listMandatoryDeadlineTitle' },
		behavior: (ctx) => ctx.injector.get(ProcurementContractMandatoryDeadlineBehavior),
	},
	form: {
		title: { key:'procurement.common.detailMandatoryDeadlineTitle' },
		containerUuid: '4f95fed11a894177975dc33975405e42',
	},
	dataService: (ctx) => ctx.injector.get(ProcurementContractMandatoryDeadlineDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.Common', typeName: 'PrcMandatoryDeadlineDto' },
	permissionUuid: 'bf1dc8854bd945928f5f890af558a5e5',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: ['IndividualPerformance', 'Start', 'End'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('procurement.common.', {
				IndividualPerformance: { key: 'entityIndividualPerformance', text: 'Individual Performance' },
				Start: { key: 'entityStart', text: 'Start' },
				End: { key: 'entityEnd', text: 'End' },
			}),
		},
	}
});
