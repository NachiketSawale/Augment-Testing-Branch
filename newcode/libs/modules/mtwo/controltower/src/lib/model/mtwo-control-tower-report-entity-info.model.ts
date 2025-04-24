/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { MtwoControlTowerReportDataService } from '../services/mtwo-control-tower-report-data.service';
import { IMtwoPowerbiItemEntity } from '@libs/mtwo/interfaces';
import { EntityDomainType } from '@libs/platform/data-access';
import { MtwoControlTowerReportBehavior } from '../behaviors/mtwo-control-tower-report-behavior.service';

/**
 * Mtwo control tower reports entity info model.
 */
export const MTWO_CONTROL_TOWER_REPORT_ENTITY_INFO: EntityInfo = EntityInfo.create<IMtwoPowerbiItemEntity>({
	grid: {
		title: { key: 'mtwo.controltower.reports' },
		behavior: (ctx) => ctx.injector.get(MtwoControlTowerReportBehavior),
	},

	dataService: (ctx) => ctx.injector.get(MtwoControlTowerReportDataService),
	dtoSchemeId: { moduleSubModule: 'MtoPowerbiitemDto', typeName: 'Mtwo.ControlTower' },
	permissionUuid: 'd682ce9579474b1097e1e04ba6e032de',
	entitySchema: {
		schema: 'IMtwoPowerbiItemEntity',
		properties: { Name: { domain: EntityDomainType.Description, mandatory: false } },
		mainModule: 'Mtwo.ControlTower',
	},
});
