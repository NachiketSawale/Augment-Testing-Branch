import { IControllingUnitEntity } from '@libs/controlling/structure';
import { ConstructionSystemMainControllingUnitsLayoutService } from '../../services/layouts/construction-system-main-controlling-units-layout.service';
import { IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsSharedFilterStructureEntityInfoFactory } from '@libs/constructionsystem/common';

export const COS_MAIN_CONTROLLING_UNITS_ENTITY_INFO = new BasicsSharedFilterStructureEntityInfoFactory<IControllingUnitEntity>().create({
	permissionUuid: '011CB0B627E448389850CDF372709F67',
	gridContainerUuid: '19458d0a77274ba48eff3af571bb2f97',
	gridTitle: 'estimate.main.controllingContainer',
	filterStructureDataServiceCreateContext: {
		qualifier: 'construction.system.main.controlling',
		dataServiceOption: {
			apiUrl: 'controlling/structure',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
			},
			entityActions: { createSupported: false, deleteSupported: false},
			roleInfo: <IDataServiceRoleOptions<IControllingUnitEntity>>{
				role: ServiceRole.Root,
				itemName: 'EstCtu',
			},
		},
	},
	dtoSchemaId: {
		moduleSubModule: 'Project.Location',
		typeName: 'LocationDto',
	},
	customizeLayoutConfiguration: () => {
		return ConstructionSystemMainControllingUnitsLayoutService.generateConfig();
	},
});