import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, TileGroup } from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';

/**
 * The module info object for the `services` preload module.
 */
export class ServicesPreloadInfo extends ModulePreloadInfoBase {
	private static _instance?: ServicesPreloadInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ServicesPreloadInfo {
		if (!this._instance) {
			this._instance = new ServicesPreloadInfo();
		}

		return this._instance;
	}

	/**
	 * Initializes a new instance.
	 * The purpose of this declaration is to make the constructor private and ensure the class is a singleton.
	 */
	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'services';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'services.schedulerui',
				displayName: {
					text: 'undefined',
					key: 'cloud.desktop.moduleDisplayNameSchedulerUI',
				},
				description: {
					text: 'undefined',
					key: 'cloud.desktop.moduleDescriptionNameSchedulerUI',
				},
				iconClass: 'ico-task-scheduler',
				color: 7897368,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'services/schedulerui',
				defaultGroupId: TileGroup.Administration,
				defaultSorting: 0, //TODO
				permissionGuid: 'd6e510f406534a8e8dcbacd79f2b13c8',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *
	 * @return An array of objects that provide some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [ContainerModuleRouteInfo.create('schedulerui', () => import('@libs/services/schedulerui').then((module) => module.ServicesScheduleruiModule))];
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
