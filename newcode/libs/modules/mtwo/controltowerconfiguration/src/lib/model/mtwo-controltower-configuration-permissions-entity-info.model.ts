/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { MtwoControlTowerConfigurationPermissionsDataService } from '../services/mtwo-controltower-configuration-permissions-data.service';
import { MtwoControlTowerConfigurationPermissionsBehaviorService } from '../behaviors/mtwo-control-tower-configuration-permissions-behavior.service';
import { IMtwoPowerbiItemEntity } from '@libs/mtwo/interfaces';
import { MtwoControlTowerConfigurationPermissionsLayoutService } from '../services/mtwo-controltower-configuration-permissions-layout.service';
import { EntityDomainType } from '@libs/platform/data-access';
import { IGridTreeConfiguration } from '@libs/ui/common';

/**
 * MtwoControl Tower Configuration Permissions entity info.
 */
export const MTWO_CONTROL_TOWER_CONFIGURATION_PERMISSIONS_ENTITY_INFO: EntityInfo = EntityInfo.create<IMtwoPowerbiItemEntity>({
	grid: {
		title: { key: 'mtwo.controltowerconfiguration.moduleAssignment' },
		behavior: (ctx) => ctx.injector.get(MtwoControlTowerConfigurationPermissionsBehaviorService),
        containerUuid:'8b7b355acb6a457e95985b07f36549fd',
		treeConfiguration: (ctx) => {
            return {
                parent: function (entity: IMtwoPowerbiItemEntity) {
                    const service = ctx.injector.get(MtwoControlTowerConfigurationPermissionsDataService);
                    return service.parentOf(entity);
                },
                children: function (entity: IMtwoPowerbiItemEntity) {
                    const service = ctx.injector.get(MtwoControlTowerConfigurationPermissionsDataService);
                    return service.childrenOf(entity);
                }
            } as IGridTreeConfiguration<IMtwoPowerbiItemEntity>;
        }
	},

	dataService: (ctx) => ctx.injector.get(MtwoControlTowerConfigurationPermissionsDataService),
	dtoSchemeId: { moduleSubModule: 'Mtwo.ControlTower', typeName: 'MtoPowerbiitemDto' },
	permissionUuid: 'd716f285c4a449159066f93cf1df1c88',
	entitySchema: {
		schema: 'IMtwoPowerbiItemEntity',
		properties: {'Name': { domain: EntityDomainType.Description, mandatory: false },},
		mainModule: 'Mtwo.ControlTower',
		additionalProperties: {
			'Description': { domain: EntityDomainType.Description, mandatory: false },
		},
	},
	layoutConfiguration: (context) => {
		return context.injector.get(MtwoControlTowerConfigurationPermissionsLayoutService).generateLayout();
	},  
});
