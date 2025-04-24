import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMainOutputDataService } from '../../services/construction-system-main-output-data.service';
import { ConstructionSystemMainOutputLayoutsService } from '../../services/layouts/construction-system-main-output-layouts.service';
import { EntityDomainType } from '@libs/platform/data-access';
import { ConstructionSystemMainOutputBehavior } from '../../behaviors/construction-system-main-output-behavior.service';

export const CONSTRUCTION_SYSTEM_MAIN_OUTPUT_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: { key: 'constructionsystem.main.outputContainerTitle' },
		containerUuid: 'ea37ce7d43c04138654976b6f20027cf',
		behavior: (context) => context.injector.get(ConstructionSystemMainOutputBehavior),
	},
	permissionUuid: '269814dc59664536bfec35409c9852a1',
	dataService: (context) => context.injector.get(ConstructionSystemMainOutputDataService),
	entitySchema: {
		schema: 'IConstructionsystemCommonInstanceErrorEntity',
		properties: {
			Instance: { domain: EntityDomainType.Text, mandatory: true },
			LoggingSource: { domain: EntityDomainType.Integer, mandatory: true },
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
	layoutConfiguration: (context) => context.injector.get(ConstructionSystemMainOutputLayoutsService).generateLayout(),
});
