/*
 * Copyright(c) RIB Software GmbH
 */

import { WorkflowInputParametersContainerComponent } from '../components/workflow-input-parameters-container/workflow-input-parameters-container.component';
import { WorkflowOutputParametersContainerComponent } from '../components/workflow-output-parameters-container/workflow-output-parameters-container.component';
import { WorkflowDesignerComponent } from '../components/workflow-designer-container/workflow-designer-container.component';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { WorkflowDebugContainerComponent } from '../components/workflow-debug-container/workflow-debug-container.component';
import { ContainerDefinition } from '@libs/ui/container-system';
import { WorkflowMainEntityLayoutConfiguration } from './layout/workflow-main-entity-layout-configuration.class';
import { WorkflowActionDetailContainerComponent } from '../components/workflow-action-detail-container/workflow-action-detail-container.component';
import { WorkflowActionParametersComponent } from '../components/workflow-action-parameters/workflow-action-parameters.component';


/**
 * Exports information about containers that will be rendered by this module.
 */
export class WorkflowMainModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new WorkflowMainModuleInfo();

	/**
	 * Initializes the module information of workflow module
	 */
	private constructor() {
		super();
	}


	/**
	 * Returns the internal name of the module
	 * @returns {string}
	 */
	public override get internalModuleName(): string {
		return 'basics.workflow';
	}

	/**
	 * Returns the entities used by the module.
	 * @returns The list of entities.
	 */
	public override get entities(): EntityInfo[] {
		return WorkflowMainEntityLayoutConfiguration.entityInfo;
	}

	/**
	 * Returns the definitions of all containers that are available in the module.
	 */
	public override get containers(): ContainerDefinition[] {
		const containerDefinitions: ContainerDefinition[] = [
			new ContainerDefinition({
				containerType: WorkflowDesignerComponent,
				uuid: 'c1abf57656fc418e8e9acc65aa0e9ea4',
				title: { text: 'Worklow Designer', key: 'basics.workflow.moduleName' }
			}),
			new ContainerDefinition({
				containerType: WorkflowInputParametersContainerComponent,
				uuid: 'c76ac86dfcb84d2f8ee94627c3cf4a40',
				title: { text: 'Worklow Input Parameters', key: 'basics.workflow.action.input.containerHeader' }
			}),
			new ContainerDefinition({
				containerType: WorkflowOutputParametersContainerComponent,
				uuid: '8e78bb9d0a7646b595ba01b23055af30',
				title: { text: 'Worklow Output Parameters', key: 'basics.workflow.action.output.containerHeader' }
			}),
			new ContainerDefinition({
				containerType: WorkflowDebugContainerComponent,
				uuid: 'd1507842b178486dae3c3c03d9268435',
				permission: '14d5f58009ff11e5a6c01697f925ec7b',
				title: { text: 'Debug', key: 'basics.workflow.debug.containerHeader' }
			}),
			new ContainerDefinition({
				containerType: WorkflowActionDetailContainerComponent,
				uuid: 'a040cedc1e2d11e5b5f7727283247c7f',
				title: { text: 'Action Detail', key: 'basics.workflow.action.containerHeader' }
			}),
			new ContainerDefinition({
				containerType: WorkflowActionParametersComponent,
				uuid: '7f93baff24f1464b8444430ca7f5cbad',
				title: {text: 'Action Parameters', key: 'basics.workflow.action.customEditor.containerHeader'},
				permission: 'c76ac86dfcb84d2f8ee94627c3cf4a40'
			})
		];

		for (const ei of this.entities) {
			containerDefinitions.push(...ei.containers);
		}
		return containerDefinitions;
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['workflow.main', 'basics.reporting']);
	}
}
