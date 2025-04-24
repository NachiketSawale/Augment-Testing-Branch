/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EntityDomainType } from '@libs/platform/data-access';
import { ConstructionSystemCommonOutputLayoutService } from '@libs/constructionsystem/common';
import { ConstructionSystemMasterOutputDataService } from '../../services/construction-system-master-output-data.service';
import { ConstructionSystemMasterOutputBehavior } from '../../behaviors/construction-system-master-output-behavior.service';

export const CONSTRUCTION_SYSTEM_MASTER_OUTPUT_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: { key: 'constructionsystem.master.outputContainerTitle' },
		containerUuid: 'ea37ce7d43c04139994976b6f26957cf',
		behavior: (context) => context.injector.get(ConstructionSystemMasterOutputBehavior),
	},
	permissionUuid: 'ea37ce7d43c04139994976b6f26957cf',
	dataService: (context) => context.injector.get(ConstructionSystemMasterOutputDataService),
	entitySchema: {
		schema: 'IConstructionSystemCommonScriptErrorEntity',
		properties: {
			CallStack: { domain: EntityDomainType.Text, mandatory: false },
			Column: { domain: EntityDomainType.Integer, mandatory: false },
			Description: { domain: EntityDomainType.Description, mandatory: false },
			ErrorType: { domain: EntityDomainType.Text, mandatory: false },
			Line: { domain: EntityDomainType.Integer, mandatory: false },
			ModelObject: { domain: EntityDomainType.Description, mandatory: false },
			Id: { domain: EntityDomainType.Integer, mandatory: false },
			Order: { domain: EntityDomainType.Integer, mandatory: false },
		},
	},
	layoutConfiguration: (context) => context.injector.get(ConstructionSystemCommonOutputLayoutService).generateLayout(),
});
