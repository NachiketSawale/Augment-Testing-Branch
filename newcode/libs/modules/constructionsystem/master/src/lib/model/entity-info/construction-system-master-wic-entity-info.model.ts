/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ICosWicEntity } from '../models';
import { ConstructionSystemMasterWicLayoutService } from '../../services/layouts/construction-system-master-wic-layout.service';
import { ConstructionSystemMasterWicDataService } from '../../services/construction-system-master-wic-data.service';
import { ConstructionSystemMasterWicValidationService } from '../../services/validations/construction-system-master-wic-validation.service';

export const CONSTRUCTION_SYSTEM_MASTER_WIC_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosWicEntity>({
	grid: {
		title: { key: 'constructionsystem.master.wicGridContainerTitle' },
	},
	form: {
		title: { key: 'constructionsystem.master.wicFormContainerTitle' },
		containerUuid: '76f471cfd25f48cc8f6306c5c4b1d6a9',
	},
	permissionUuid: '1cd70e4c9e1740c39e00213c9745153f',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosWicDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterWicDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterWicValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterWicLayoutService).generateLayout(),
});
