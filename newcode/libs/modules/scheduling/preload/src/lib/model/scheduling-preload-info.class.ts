import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, IWizard, TileGroup, IInitializationContext, Dictionary } from '@libs/platform/common';

import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
export class SchedulingPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new SchedulingPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'scheduling';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'scheduling.templategroup',
				displayName: {
					text: 'Template Group',
					key: 'cloud.desktop.moduleDisplayNameActivityTemplateGroup',
				},
				description: {
					text: '',
					key: 'cloud.desktop.moduleDescriptionActivityTemplateGroup',
				},
				iconClass: 'ico-activity-groups',
				color: 3701306,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'scheduling/templategroup',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: 'f3edb74b1a7a47d487582a8955a2883f',
			},
			{
				id: 'scheduling.template',
				displayName: {
					text: 'Activity Template',
					key: 'cloud.desktop.moduleDisplayNameActivityTemplate',
				},
				description: {
					text: '',
					key: 'cloud.desktop.moduleDescriptionActivityTemplate',
				},
				iconClass: 'ico-activity-templates',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'scheduling/template',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '4e6cd17421314562879c674c9fa8a003',
			},

			{
				id: 'scheduling.calendar',
				tileSize: TileSize.Small,
				color: 1926037,
				opacity: 1,
				iconClass: 'ico-calendar',
				iconColor: 16777215,
				textColor: 16777215,
				displayName: {
					text: 'Calendar',
					key: 'cloud.desktop.moduleDisplayNameCalendar',
				},
				description: {
					text: 'Calendar Module',
					key: 'cloud.desktop.moduleDescriptionCalendar',
				},
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 10,
				permissionGuid: 'cae4ae45a0e0482d94f4003ca930609f',
				targetRoute: 'scheduling/calendar',
			},
			{
				id: 'scheduling.main',
				displayName: {
					text: 'Scheduling',
					key: 'cloud.desktop.moduleDisplayNameSchedulingMain',
				},
				description: {
					text: 'Scheduling Main',
					key: 'cloud.desktop.moduleDescriptionSchedulingMain',
				},
				iconClass: 'ico-scheduling',
				color: 30694,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'scheduling/main',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'e84fefd9c8394d95853c82bc1dcb002c',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 * @protected
	 *
	 * @return {Array<ISubModuleRouteInfo>} An array of objects that provides some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('calendar', () => import('@libs/scheduling/calendar').then((module) => module.SchedulingCalendarModule)),
			ContainerModuleRouteInfo.create('templategroup', () => import('@libs/scheduling/templategroup').then((module) => module.SchedulingTemplategroupModule)),
			ContainerModuleRouteInfo.create('template', () => import('@libs/scheduling/template').then((module) => module.SchedulingTemplateModule)),
			ContainerModuleRouteInfo.create('main', () => import('@libs/scheduling/main').then((module) => module.SchedulingMainModule))
		];
	}

	public override get wizards(): IWizard[] | null {
		return [
			{
				uuid: '81cb872e1e4f4607b89b6f86dfc80c33',
				name: 'Create Bank Holiday',
				async execute(context: IInitializationContext, wizardParameter?: Dictionary<string, unknown>): Promise<void> {
					let parameter: number | undefined;
					// Check if wizardParameter is provided and contains a valid 'Typ' value
					if (wizardParameter !== undefined) {
						const typValue = wizardParameter.get('Typ');
						if (typeof typValue === 'string' && !isNaN(Number(typValue))) {
							parameter = Number(typValue);
						}
					}
					// Ensure parameter is assigned a valid value before use
					if (parameter !== undefined) {
						// Dynamically import the module
						const module = await import('@libs/scheduling/calendar');
						// Call the createBankHoliday method with the context and parameter
						await new module.SchedulingCalendarMainWizard().createBankHoliday(context, parameter);
					} else {
						// Handle the case where parameter is undefined
						throw new Error('Parameter Typ is required and must be a valid number.');
					}
				},
			},
			{
				uuid: '41acb6a864df4085924df772f45286d2',
				name: 'Disable Calendar',
				execute: (context) => {
					return import('@libs/scheduling/calendar').then((module) => new module.SchedulingCalendarMainWizard().disableCalendar(context));
				},
			},
			{
				uuid: 'dc3207967e644708b0187820c5958129',
				name: 'Enable Calendar',
				execute: (context) => {
					return import('@libs/scheduling/calendar').then((module) => new module.SchedulingCalendarMainWizard().enableCalendar(context));
				},
			},
			{
				uuid: '34b854f51d024f67abb0da8334b1f531',
				name: 'Delete Calendar',
				execute: (context) => {
					return import('@libs/scheduling/calendar').then((module) => new module.SchedulingCalendarMainWizard().deleteCalendar(context));
				},
			},
			{
				uuid: '132740d611d04ffbb08240db33fadd7a',
				name: 'scheduling.main.createBaseline',
				execute(context): Promise<void> | undefined {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().createBaseline(context));
				}
			},
			{
				uuid: 'b752383d74574ad0bd8b7624a82057fe',
				name: 'scheduling.main.deleteBaseline',
				execute(context): Promise<void> | undefined {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().deleteBaseline(context));
				}
			},
			{
				uuid: 'b62429dd3e994c18a752ae5c3c0e3697',
				name: 'scheduling.main.applyPerformanceSheet',
				execute(context): Promise<void> | undefined {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().applyPerformanceSheet(context));
				}
			},
			{
				uuid: 'caa5566cd7ea4b9bb8bdd4d9f480ab9f',
				name: 'scheduling.main.assignCUs',
				execute(context): Promise<void> | undefined {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().assignControllingUnits(context));
				}
			},
			{
				uuid: 'ebadaf24b7584cbfa70a12c77e5044d9',
				name: {text: 'Split Activity By Locations', key:'scheduling.main.splitActivityByLocations'},
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().splitActivityByLocations(context));
				},
			},
			{
				uuid: '8066d42670734304b2dd0f3716fda9ae',
				name: 'scheduling.main.addProgressToScheduleActivity',
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().addProgressToScheduledActivities(context));
				},
			},
			{
				uuid: 'ae78379a694343ec8f18a9a56bd8c4a3',
				name: {text: 'Renumber Activities', key:'scheduling.main.renumberActivities'},
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().renumberActivities(context));
				}
			},
			{
				uuid: 'f669cdf521ff4bedb3b46f5d31ba9136',
				name: 'scheduling.main.rescheduleUncompletedActivities',
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().rescheduleUncompletedActivities(context));
				},
			},
			{
				uuid: 'cf22bbb9070c49fdbeda856ce3132692',
				name: 'scheduling.main.synchronizeSchedules',
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().synchronizeSchedules(context));
				},
			},

			{
				uuid: 'a9076c01f8824bcba5130d1688161d3b',
				name: 'scheduling.main.rescheduleActivities',
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().rescheduleActivities(context));
				},
			},
			{
				uuid: '01d146a3b16343fa8232dc70c5936df6',
				name: 'scheduling.main.criticalPath',
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().criticalPath(context));
				},
			},
			{
				uuid: 'f369c3823eec42a7857fcc491705d092',
				name: 'scheduling.main.exportToMSProject',
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().exportToMSProject(context));
				}
			},
			{
				uuid: 'f31d20df37b44601a4b89254f5544ee4',
				name: 'scheduling.main.importMSProject',
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().importMSProject(context));
				}
			},
			{
				uuid: 'adcc6022ce2a4fa1a1bef5d720f800e7',
				name: 'scheduling.main.changeActivityState',
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().changeActivityStatus(context));
				},
			},
			{
				uuid: '6402d82942f349ad8af3fb935772bd17',
				name: 'scheduling.main.changeActivityStateOfAllActivities',
				execute: (context) => {
					return import('@libs/scheduling/main').then((module) => new module.SchedulingMainWizard().changeActivityStateOfAllActivities(context));
				}
			}
		];
	}

	/**
	 * Returns all lazy injectable providers from all sub-modules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}
}
