/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ISharedMandatoryDeadlinesEntity } from '@libs/sales/shared';
import { SalesContractMandatoryDeadlinesBehavior } from '../../behaviors/sales-contarct-mandatory-deadlines-behaviour.service';
import { SalesContractMandatoryDeadlinesDataService } from '../../services/sales-contract-mandatory-deadlines-data.service';

export const SALES_CONTRACT_MANDATORY_DEADLINES_ENTITY_INFO: EntityInfo = EntityInfo.create<ISharedMandatoryDeadlinesEntity> ({
	grid: {
		title: {key: 'procurement.common.listMandatoryDeadlineTitle'},
		behavior: ctx => ctx.injector.get(SalesContractMandatoryDeadlinesBehavior),
	},
	form: {
		title: { key: 'procurement.common.detailMandatoryDeadlineTitle' },
		containerUuid: '39b8a1bb45dc4c0e9fd568b86d223ba9'
	},
	dataService: ctx => ctx.injector.get(SalesContractMandatoryDeadlinesDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Common', typeName: 'OrdMandatoryDeadlineDto'},
	permissionUuid: 'a3447994949644c5be260efdeeb1412d',
	layoutConfiguration: {
		groups: [
			{ gid: 'Basic Data', attributes: ['IndividualPerformance', 'Start', 'End'] },
		],
		overloads: {
			IndividualPerformance: { label: { text: 'Individual Performance', key: 'IndividualPerformance' }, visible: true },
			Start: { label: { text: 'Start', key: 'Start' }, visible: true },
			End: { label: { text: 'End', key: 'End' }, visible: true }
		},
		labels: {
			...prefixAllTranslationKeys('sales.contract.', {
				BasWarrantysecurityFk: {key: 'entityWarrantySecurityFk'},
				BasWarrantyobligationFk: {key: 'entityWarrantyObligationFk'}
			}),
		},
	}
});