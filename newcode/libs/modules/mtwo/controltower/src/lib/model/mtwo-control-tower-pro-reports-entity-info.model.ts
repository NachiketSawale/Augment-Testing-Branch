/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { IMtwoPowerbiItemEntity } from '@libs/mtwo/interfaces';
import { EntityDomainType } from '@libs/platform/data-access';

import { MtwoControlTowerProReportBehavior } from '../behaviors/mtwo-control-tower-pro-report-behavior.service';
import { MtwoControlTowerProReportsDataService } from '../services/mtwo-control-tower-pro-reports-data.service';


/**
 * Mtwo control tower pro reports entity info model.
 */
export const MTWO_CONTROL_TOWER_PRO_REPORTS_ENTITY_INFO: EntityInfo = EntityInfo.create<IMtwoPowerbiItemEntity>({
	grid: {
		title: { key: 'mtwo.controltower.proReports' },
		behavior: (ctx) => ctx.injector.get(MtwoControlTowerProReportBehavior),
        containerUuid: '0375f8eb73ab4de99ea00bb1afc2ba3a'
	},

	dataService: (ctx) => ctx.injector.get(MtwoControlTowerProReportsDataService),
	dtoSchemeId: { moduleSubModule: 'MtoPowerbiitemDto', typeName: 'Mtwo.ControlTower' },
	permissionUuid: 'd682ce9579474b1097e1e04ba6e032de',
	entitySchema: {
		schema: 'IMtwoPowerbiItemEntity',
		properties: { Name: { domain: EntityDomainType.Description, mandatory: false } },
		mainModule: 'Mtwo.ControlTower',
	},
});
