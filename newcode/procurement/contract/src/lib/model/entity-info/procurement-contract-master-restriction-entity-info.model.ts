/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IConMasterRestrictionEntity } from '../entities/con-master-restriction-entity.interface';
import { ProcurementContractMasterRestrictionDataService } from '../../services/procurement-contract-master-restriction-data.service';
import { ProcurementContractMasterRestrictionLayoutService } from '../../services/procurement-contract-master-restriction-layout.service';

export const PROCUREMENT_CONTRACT_MASTER_RESTRICTION_ENTITY_INFO = EntityInfo.create<IConMasterRestrictionEntity>({
	grid: {
		title: { text: 'Master Restriction', key: 'procurement.contract.masterRestrictionGridTitle' }
	},
	form: {
		containerUuid: 'b3d8667528184d69908c505d76729efd',
		title: { text: 'Master Restriction Detail', key: 'procurement.contract.masterRestrictionFormTitle' },
	},
	dataService: ctx => ctx.injector.get(ProcurementContractMasterRestrictionDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.Contract', typeName: 'ConMasterRestrictionDto' },
	permissionUuid: '5f355e34c4dc43a2a7e5dcda155afc92',
	layoutConfiguration: context => {
		return context.injector.get(ProcurementContractMasterRestrictionLayoutService).generateConfig();
	}
});