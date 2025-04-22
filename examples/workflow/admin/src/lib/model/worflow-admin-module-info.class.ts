/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition } from '@libs/ui/container-system';
import { WorkflowAdminEntityLayoutConfiguration } from './layout/workflow-admin-entity-layout-configuration.class';
import { WorkflowInstanceContextComponent } from '../components/workflow-instance-context-container/workflow-instance-context.component';
import { WorkflowActionInstanceContextComponent } from '../components/workflow-action-instance-context-container/workflow-action-instance-context.component';
import { WorkflowDataHubComponent } from '../components/workflow-data-hub-container/workflow-data-hub.component';

export class WorkflowAdminModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new WorkflowAdminModuleInfo();

	/**
	 * Initializes the module information of workflow admin module
	 */
	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module
	 * @returns {string}
	 */
	public override get internalModuleName(): string {
		return 'basics.workflowAdministration';
	}

	/**
	 * Returns the definitions of all containers that are available in the module.
	 */
	public override get containers(): ContainerDefinition[] {
		const containerDefinitions: ContainerDefinition[] = [
			new ContainerDefinition({
				containerType: WorkflowInstanceContextComponent,
				uuid: '8d61c1ee263a11e5b345feff819cdc9f',
				title: {text: 'Workflow Context', key: ''},
			}),
			new ContainerDefinition({
				containerType: WorkflowActionInstanceContextComponent,
				uuid: '612085cc72fb4a9ca3ec9dba7b97db36',
				permission: 'bb214b5c3a7d11e5a151feff819cdc9f',
				title: {text: 'Action Context', key: ''}
			}),
			new ContainerDefinition({
				containerType: WorkflowDataHubComponent,
				uuid: '1759d8f48c2e499d8c43df6c5c3bb98a',
				permission: 'bb214b5c3a7d11e5a151feff819cdc9f',
				title: {text: 'Datahub', key: ''}
			})
		];

		for (const ei of this.entities) {
			containerDefinitions.push(...ei.containers);
		}
		return containerDefinitions;
	}

	/**
	 * Returns the entities used by the module.
	 * @returns The list of entities.
	 */
	public override get entities(): EntityInfo[] {
		return WorkflowAdminEntityLayoutConfiguration.entityInfo;
	}

	/**
	 * Loads the translation file used for workflow admin
	 */
	public override get preloadedTranslations(): string[] {
		return [
			'workflow.admin',
			'workflow.main'
		];
	}
}