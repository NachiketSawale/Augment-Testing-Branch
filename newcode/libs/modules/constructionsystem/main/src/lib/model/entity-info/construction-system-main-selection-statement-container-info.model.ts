/*
 * Copyright(c) RIB Software GmbH
 */
import { SelectionStatementContainerFactory } from '@libs/constructionsystem/common';
import { ConstructionSystemMainInstanceDataService } from '../../services/construction-system-main-instance-data.service';
import { ConstructionSystemMainJobDataService } from '../../services/construction-system-main-job-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MAIN_SELECTION_STATEMENT_CONTAINER_DEFINITION = SelectionStatementContainerFactory.create<ICosInstanceEntity>({
	uuid: '35d552e8a44042a5aefb616a62ff3a5a',
	permission: 'c17ce6c31f454e18a2bc84de91f72f48',
	title: 'constructionsystem.main.instanceSelectionStatementContainerTitle',
	parentServiceToken: ConstructionSystemMainInstanceDataService,
	showExecute: true,
	limitModel: false,
	getModelIdFn: () => {
		const instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);
		return instanceService.getCurrentSelectedModelId();
	},
	executeFn: () => {
		const jobDataService = ServiceLocator.injector.get(ConstructionSystemMainJobDataService);
		jobDataService.createObjectAssignJob(false);
	},
});
