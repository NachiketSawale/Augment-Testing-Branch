/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMainInstanceDataService } from '../../services/construction-system-main-instance-data.service';
import { ConstructionSystemMainInstanceBehavior } from '../../behaviors/construction-system-main-instance-behavior.service';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainInstanceValidationService } from '../../services/validations/construction-system-main-instance-validation.service';
import { ConstructionSystemMainInstanceLayoutService } from '../../services/layouts/construction-system-main-instance-layout.service';
import { CosUserFormComponent } from '../../components/cos-user-form/cos-user-form.component';

export const CONSTRUCTION_SYSTEM_MAIN_INSTANCE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosInstanceEntity>({
	grid: {
		title: { key: 'constructionsystem.main.instanceGridContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMainInstanceBehavior),
	},
	form: {
		title: { key: 'constructionsystem.main.instanceFormContainerTitle' },
		containerUuid: '90f746cdd8c64f819e89b7b6e9993536',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainInstanceDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMainInstanceValidationService),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Main', typeName: 'InstanceDto' },
	permissionUuid: 'c17ce6c31f454e18a2bc84de91f72f48',
	layoutConfiguration: (context) => {
		return context.injector.get(ConstructionSystemMainInstanceLayoutService).generateLayout(context);
	},
	additionalEntityContainers: [
		{
			uuid: '8ad6088d3d56499c8459ef44e6d9d4d8',
			permission: 'c17ce6c31f454e18a2bc84de91f72f48',
			title: 'constructionsystem.main.instanceUserFormContainerTitle',
			containerType: CosUserFormComponent,
		},
	],
});
