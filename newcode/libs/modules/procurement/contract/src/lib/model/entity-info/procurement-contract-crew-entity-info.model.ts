/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementContractCrewDataService } from '../../services/procurement-contract-crew-data.service';
import { ProcurementContractCrewLayoutService } from '../../services/procurement-contract-crew-layout.service';
import { IConCrewEntity } from '../entities/con-crew-entity.interface';

export const PROCUREMENT_CONTRACT_CREW_ENTITY_INFO = EntityInfo.create<IConCrewEntity>({
	grid: {
		title: { text: 'Crew', key: 'procurement.contract.crewGridTitle' }
	},
	form: {
		containerUuid: 'cd70f3e8a849453dbcce28e511b9bea6',
		title: { text: 'Crew Detail', key: 'procurement.contract.crewFormTitle' },
	},
	dataService: ctx => ctx.injector.get(ProcurementContractCrewDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.Contract', typeName: 'ConCrewDto' },
	permissionUuid: '518782bb7e024921b68890d83332867a',
	layoutConfiguration: context => {
		return context.injector.get(ProcurementContractCrewLayoutService).generateConfig();
	}
});