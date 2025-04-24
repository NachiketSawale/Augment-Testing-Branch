/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IConHeaderEntity } from '../entities';
import { ProcurementContractHeaderLayoutService } from '../../services/procurement-contract-header-layout.service';
import { ProcurementContractCallOffsDataService } from '../../services/procurement-contract-call-offs-data.service';
import { PROCUREMENT_CONTRACT_CALL_OFFS_BEHAVIOR_TOKEN } from '../../behaviors/procurement-contract-call-offs-behavior.service';

export const PROCUREMENT_CONTRACT_CALL_OFFS_ENTITY_INFO = EntityInfo.create<IConHeaderEntity>({
	grid: {
		containerUuid: '3d7d0bc341bf427ca69e1dead1d5e767',
		title: {text: 'Call Offs', key: 'procurement.contract.callOffsContainer'},
		behavior: PROCUREMENT_CONTRACT_CALL_OFFS_BEHAVIOR_TOKEN,
		treeConfiguration: true
	},
	dataService: ctx => ctx.injector.get(ProcurementContractCallOffsDataService),
	dtoSchemeId: {moduleSubModule: 'Procurement.Contract', typeName: 'ConHeaderDto'},
	permissionUuid: '1358a3d7ad534a86a38393d64de36486',
	layoutConfiguration: context => {
		return context.injector.get(ProcurementContractHeaderLayoutService).generateLayout(context);
	}
});