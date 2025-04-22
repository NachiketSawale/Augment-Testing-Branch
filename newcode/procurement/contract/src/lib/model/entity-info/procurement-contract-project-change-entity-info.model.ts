/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementContractProjectChangeLayoutService } from '../../services/procurement-contract-project-change-layout.service';
import { ProcurementContractProjectChangeDataService } from '../../services/procurement-contract-project-change-data.service';
import { ProcurementContractProjectChangeBehavior } from '../../behaviors/procurement-contract-project-change-behavior.service';
import { IChangeEntity } from '../entities/change-entity.interface';

export const PROCUREMENT_CONTRACT_PROJECT_CHANGE_ENTITY_INFO = EntityInfo.create<IChangeEntity>({
	grid: {
		title: { text: 'Project Change', key: 'procurement.contract.projectChangeTitle' },
		behavior:ctx=>ctx.injector.get(ProcurementContractProjectChangeBehavior)
	},
	form: {
		containerUuid: 'e7b68e56026c414f9e50e3017467e753',
		title: { text: 'Project Change Detail', key: 'procurement.contract.detailChangeTitle' },
	},
	dataService: ctx => ctx.injector.get(ProcurementContractProjectChangeDataService),
	dtoSchemeId: { moduleSubModule: 'Change.Main', typeName: 'ChangeDto' },
	permissionUuid: '9d95591bec814875bed99ec4919374b4',
	layoutConfiguration: context => {
		return context.injector.get(ProcurementContractProjectChangeLayoutService).generateConfig();
	}
});