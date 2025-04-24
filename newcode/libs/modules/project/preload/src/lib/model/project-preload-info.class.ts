/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISubModuleRouteInfo, ITile, IWizard, LazyInjectableInfo, ModulePreloadInfoBase, TileGroup, TileSize } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import {PROJECT_SERVICE_TOKEN} from '@libs/project/interfaces';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { PROJECT_INFO_REQUEST_WIZARDS } from './wizards/project-info-request-wizards';

export class ProjectPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new ProjectPreloadInfo();

	private constructor() {
		super();
	}
	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'project';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'project.droppoints',
				displayName: {
					text: 'Project Drop Points',
					key: 'cloud.desktop.moduleDisplayNameProjectDropPoints'
				},
				description: {
					text: 'Organization of Drop Points',
					key: 'cloud.desktop.moduleDescritptionNameProjectDropPoints'
				},
				iconClass: 'ico-jobcard-template',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'project/droppoints',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 12,
				permissionGuid: '2311055fcfbe4a55b51cda1caf41d19e'
			},
			{
				id: 'project.main',
				displayName: {
					text: 'Projects',
					key: 'cloud.desktop.moduleDisplayNameProjectMain',
				},
				description: {
					text: 'Management of Projects',
					key: 'cloud.desktop.moduleDescriptionProjectMain',
				},
				iconClass: 'ico-project',
				tileSize: TileSize.Large,
				defaultSorting: 1,
				color: 690687,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				defaultGroupId: TileGroup.Programs,
				permissionGuid: 'bba88645983a4c6fa26418f58ca85dbe',
				targetRoute: 'project/main',
			},
			{
				id: 'project.group',
				displayName: {
					text: 'Project Group',
					key: 'cloud.desktop.moduleDisplayNameProjectGroup',
				},
				description: {
					text: 'Management of Project Groups',
					key: 'cloud.desktop.moduleDescriptionProjectGroup',
				},
				iconClass: 'ico-project',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'project/group',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 2,
				permissionGuid: 'fb65f2a8600b48f9b79d2cc0fa3bd3b3',
			},
			{
				id: 'project.inforequest',
				displayName: {
					text: 'Info Request',
					key: 'cloud.desktop.moduleDisplayNameInfoRequest',
				},
				description: {
					text: 'Management of Info Reques',
					key: 'cloud.desktop.moduleDescriptionInfoRequest',
				},

				iconClass: 'ico-request-for-information',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: 0,
				defaultSorting: 3,
				defaultGroupId: TileGroup.Programs,
				permissionGuid: '6d0a845d35cb4f1bb53673faf7fcd19f',
				targetRoute: 'project/inforequest',
			},
		];
	}

	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('droppoints', () => import('@libs/project/droppoints').then((module) => module.ProjectDropPointsModule)),
			ContainerModuleRouteInfo.create('main', () => import('@libs/project/main').then((module) => module.ProjectMainModule)),
			ContainerModuleRouteInfo.create('location', () => import('@libs/project/location').then((module) => module.ProjectLocationModule)),
			ContainerModuleRouteInfo.create('group', () => import('@libs/project/group').then((module) => module.ProjectGroupModule)),
			ContainerModuleRouteInfo.create('inforequest', () => import('@libs/project/inforequest').then((module) => module.ProjectInfoRequestModule)),
		];
	}

	public override get lazyInjectables(): LazyInjectableInfo[] {
		return [
			LazyInjectableInfo.create('project.data-service', PROJECT_SERVICE_TOKEN, async (ctx) => {
				const m = await import('@libs/project/shared');
				return ctx.doInstantiate ? ctx.injector.get(m.ProjectMainDataService) : null;
			}),
			...LAZY_INJECTABLES
		];
	}

	public override get wizards(): IWizard[] | null {
		return [
			...PROJECT_INFO_REQUEST_WIZARDS,
			{
				uuid: '7d62386026ce43c09ec144a8e0f7ed5d',
				name: 'project.main.updateCostCodesPricesTitle',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().updateCostCodesPriceByPriceList(context));
				},
			},
			{
				uuid: '87DAB0BB2B604DA3B25FB3BF322C47A1',
				name: 'update Material',
				execute: (context) => {
					return import('@libs/project/material').then((module) => new module.ProjectMaterialWizard().updateMaterialPrice(context));
				},
			},
			{
				uuid: 'b50a2432717246be8c0b0e5c33b774e3',
				name: 'project.main.entityChangeProjectGroup',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().changeProjectGroup(context));
				},
			},
			{
				uuid: '406208ef14fe41c59d194108b1340cbf',
				name: 'project.main.entityChangeProjectNumber',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().changeProjectNumber(context));
				},
			},
			{
				uuid: '6039d1766dc74505968418cb699c0c5a',
				name: 'project.main.changeStatus',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().changeProjectStatus(context));
				},
			},
			{
				uuid: 'dad14b5891304aa4bd63feafaa220119',
				name: 'project.main.createProjectTitle',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().createProject(context));
				},
			},
			{
				uuid: '44893e9cb12a4e5dae90b4f09e4e51e2',
				name: 'project.main.createAlternativeTitle',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().createProjectAlternativeWizard(context));
				},
			},
			{
				uuid: '8321d22cd752416f8922f9bb9755bbd0',
				name: 'project.main.setActiveAlternativeTitle',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().setActiveProjectAlternative(context));
				},
			},
			{
				uuid: 'b0a627bbcae04bc8a773d038f936a915',
				name: 'project.main.disableProjectTitle',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().disableProject(context));
				},
			},
			{
				uuid: '442d87ae14d84adf870f6dcdf164e598',
				name: 'Set Group Status',
				execute: (context) => {
					return import('@libs/project/group').then((module) => new module.ProjectGroupWizard().setGroupStatus(context));
				},
			},
			{
				uuid: '44893e9cb12a4e5dae90b4f09e4e51e2',
				name: 'project.main.createAlternativeTitle',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().createProjectAlternativeWizard(context));
				},
			},
			{
				uuid: 'f3555636d16e4400b6be2ccd6f6a3ac2',
				name: 'project.main.enableProjectTitle',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().enableProject(context));
				},
			},
			{
				uuid: 'd2601e1ab46940aeaa6842d4c39b9d68',
				name: 'project.main.makeProject5DTemplateTitle',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().make5DTemplateProject(context));
				},
			},
			{
				uuid: 'fc93b5276c77427b87f6c0d27d0bfa22',
				name: 'project.main.makeTemplateProjectTitle',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().makeTemplateProject(context));
				},
			},
			{
				uuid: '7c37111ee5b4411eba4cb59be39b260b',
				name: 'project.main.makeNormalProjectTitle',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().makeNormalProject(context));
				},
			},
			{
				uuid: '002E6EE4867842B5A8F28045B803EDA7',
				name: 'project.main.updatePlantAssemblyWizard.wizardTitle',
				execute: (context) => {
					return import('@libs/project/plantassembly').then((module) => new module.ProjectPlantassembly().updateEquipmentAssembly(context));
				},
			},
            {
				uuid: '8981AAD8A8F241B8A18E5EBC12983BF8',
				name: 'estimate.main.wizardChangeEstimateStatus',
				execute: (context) => {
					return import('@libs/estimate/project').then((module) => new module.EstimateProjectWizard().changeEstimateStatus(context));
				},
			},
			{
				uuid: '7c63215cd71b4b8bab0e87292a775669',
				name: 'Reschedule Selected Schedules',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().reScheduleAllSchedules(context));
				},
			},
			{
				uuid: '6cbf0ef900e242028c46da3af06b06e5',
				name: 'Change Schedule Status',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().setScheduleStatus(context));
				},
			},
			{
				uuid: '52e41c22df5a4de3b01a87dcaa73c25d',
				name: 'project.main.titleUpdateCurrencyExchangeRates',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().setProjectCurrencyRate(context));
				},
			},
			{
				uuid: '791e39436c4a44b99469ec38f84f433d',
				name: 'Change Boq Status',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().changeBoqHeaderStatus(context));
				},
			},
			{
				uuid: 'c831fe3e710449448149321bcbca5576',
				name: 'Synchronize RIB 4.0 project to Autodesk BIM 360',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().postProjectToAutodeskBim360(context));
				}
			},
			{
				uuid: '1D956E198DA94C12A48DF0BAE82C4D19',
				name: 'Update Project Assembly',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().updateAssemblies(context));
				}
			},
			{
				uuid: '33E51015EC744506B7A5849C57DD3C2A',
				name: 'Recalculate Project Assembly',
				execute: (context) => {
					return import('@libs/project/main').then((module) => new module.ProjectMainWizards().updateAssemblyStructure(context));
				}
			},
			{
				uuid: 'CC00D36F3B124A36A60CE4FEE703AB97',
				name: 'model.viewer.changeModelWz.title',
				execute: (context) => {
					return import('@libs/constructionsystem/project').then((module) => new module.ConstructionSystemProjectWizard().changeModel(context));
				}
			},
			{
				uuid: 'a041c4f180c74d6fb1ac5ebef949a2d1',
				name: 'constructionsystem.project.changeInstanceHeaderStatus',
				execute: (context) => {
					return import('@libs/constructionsystem/project').then((module) => new module.ConstructionSystemProjectWizard().changeInstanceHeaderStatus(context));
				}
			},
			{
				uuid: 'afd921a3846840f49c9991c5a771e3f3',
				name: 'Compare COS Instance Header',
				execute: (context) => {
					return import('@libs/constructionsystem/project').then((module) => new module.ConstructionSystemProjectWizard().compareCosInstanceHeader(context));
				}
			},
		];
	}
}
