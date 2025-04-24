/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition } from '@libs/ui/container-system';
import { WorkflowTaskEntityLayoutConfiguration } from './layout/workflow-task-entity-layout-configuration.class';


/**
 * Exports information about containers that will be rendered by this module.
 */
export class WorkflowTaskModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new WorkflowTaskModuleInfo();

	/**
	 * Initializes the module information of workflow task module.
	 */
	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @returns {string}
	 */
	public override get internalModuleName(): string {
		return 'basics.workflowTask';
	}

	/**
	 * Returns the entities used by the module.
	 * @returns The list of entities.
	 */
	public override get entities(): EntityInfo[] {
		return WorkflowTaskEntityLayoutConfiguration.entityInfo;
	}

	/**
	 * Returns the definitions of all containers that are available in the module.
	 */
	public override get containers(): ContainerDefinition[] {
		const containerDefinitions: ContainerDefinition[] = [
			/*new ContainerDefinition({
				containerType: WorkflowTaskDetailComponent,
				uuid: '7ed6761e1202439994c93508580401d2',
				title: {text: 'Task Detail', key: 'basics.workflowTask.detail.header'},
				permission: 'de3095bfba7c442f8bf77c91d2174c72'
			})*/
		];

		for (const ei of this.entities) {
			containerDefinitions.push(...ei.containers);
		}
		return containerDefinitions;
	}

	/**
	 * Loads the translation file used for workflow task.
	 */
	public override get preloadedTranslations(): string[] {
		return [
			'workflow.task',
			'workflow.main'
		];
	}
}
