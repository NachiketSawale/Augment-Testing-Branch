/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Dictionary,
	IInitializationContext,
	ISubModuleRouteInfo,
	ITile,
	IWizard,
	LazyInjectableInfo,
	ModulePreloadInfoBase,
	TileGroup,
	TileSize
} from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';

/**
 * Preloads the tiles, wizards and routes for workflow module.
 */
export class WorkflowPreloadInfo extends ModulePreloadInfoBase {

	public static readonly instance = new WorkflowPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public get internalModuleName(): string {
		return 'basics';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'Workflow.main',
				tileSize: TileSize.Large,
				color: 12072000,
				opacity: 1,
				iconClass: 'ico-workflow-designer',
				iconColor: 11666777,
				textColor: 1111111,
				displayName: {
					text: 'Workflow Main',
					key: 'cloud.desktop.moduleDisplayNameWorkflowMain',
				},
				description: {
					text: 'Workflow Module',
					key: 'cloud.desktop.moduleDescriptionWorkflowMain',
				},
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 10,
				permissionGuid: 'f69464ef96d548f59ccff8337afc9a2e',
				targetRoute: 'basics/workflow',
			},
			{
				id: 'Workflow.admin',
				tileSize: TileSize.Large,
				color: 444444444444,
				opacity: 1,
				iconClass: 'ico-workflow-instance',
				iconColor: 11666777,
				textColor: 99999999,
				displayName: {
					text: 'Workflow Admin',
					key: 'cloud.desktop.moduleDisplayNameWorkflowAdmin',
				},
				description: {
					text: 'Workflow Admin',
					key: 'cloud.desktop.moduleDescriptionWorkflowAdmin',
				},
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 11,
				permissionGuid: '8041286797b04f35aa920b4f6442989c',
				targetRoute: 'basics/workflowAdministration',
			},
			{
				id: 'Workflow.task',
				tileSize: TileSize.Large,
				color: 3704191,
				opacity: 0.9,
				iconClass: 'ico-task',
				iconColor: 16777215,
				textColor: 16777215,
				displayName: {
					text: 'Workflow Task',
					key: 'cloud.desktop.moduleDisplayNameWorkflowTask',
				},
				description: {
					text: 'Workflow Task Module',
					key: 'cloud.desktop.moduleDescriptionNameWorkflowTask',
				},
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 12,
				permissionGuid: '37876a44641f4177bd1ee51d08ad6313',
				targetRoute: 'basics/workflowTask',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *  @protected
	 * @returns {ISubModuleRouteInfo[]} An array of objects that provides some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('workflow', () => import('@libs/workflow/main').then((module) => module.WorkflowMainModule)),
			ContainerModuleRouteInfo.create('workflowAdministration', () => import('@libs/workflow/admin').then((module) => module.WorkflowAdminModule)),
			ContainerModuleRouteInfo.create('workflowTask', () => import('@libs/workflow/task').then((module) => module.WorkflowTaskModule)),
		];
	}

	public override get wizards(): IWizard[] | null {
		return [
			{
				uuid: 'b33407a3003f42e9b86f1f13616b47cb',
				execute(context: IInitializationContext, wizardParameter?: Dictionary<string, unknown>): Promise<void> | undefined {
					if (wizardParameter) {
						console.log(wizardParameter.get('TemplateId'));
					}
					return undefined;
				},
				description: 'Start workflow wizard',
				name: 'StartWorkflowWizard'
			}
		];
	}

	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}
}
