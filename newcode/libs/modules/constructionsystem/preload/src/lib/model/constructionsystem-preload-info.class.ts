/*
 * Copyright(c) RIB Software GmbH
 */
import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, TileGroup, IWizard } from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { CONSTRUCTION_SYSTEM_MASTER_WIZARDS } from './wizards/constructionsystem-master-wizards.class';
import { CONSTRUCTION_SYSTEM_MAIN_WIZARDS } from './wizards/constructionsystem-main-wizards.class';

/**
 * The module info object for the `constructionsystem` preload module.
 */
export class ConstructionsystemPreloadInfo extends ModulePreloadInfoBase {
	private static _instance?: ConstructionsystemPreloadInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ConstructionsystemPreloadInfo {
		if (!this._instance) {
			this._instance = new ConstructionsystemPreloadInfo();
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
		return 'constructionsystem';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'constructionsystem.main',
				displayName: {
					text: 'Construction System Instance',
					key: 'cloud.desktop.moduleDisplayNameConstructionSystemInstance',
				},
				description: {
					text: 'Construction System',
					key: 'cloud.desktop.moduleDescriptionConstructionSystemInstance',
				},
				iconClass: 'ico-construction-system',
				color: 30694,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'constructionsystem/main',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '76efcb5a5e60455485a024399262f0bf',
			},
			{
				id: 'constructionsystem.master',
				displayName: {
					text: 'Construction System Master',
					key: 'cloud.desktop.moduleDisplayNameConstructionSystemMaster',
				},
				description: {
					text: 'Construction System',
					key: 'cloud.desktop.moduleDescriptionConstructionSystemMaster',
				},
				iconClass: 'ico-construction-system-master',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'constructionsystem/master',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: 'c4838e19b1904d5492472cffe03c92a0',
			},
		];
	}

	/**
	 * Returns all wizards provided by the module.
	 *
	 * @returns The array of wizard declarations.
	 */
	public override get wizards(): IWizard[] {
		return [...CONSTRUCTION_SYSTEM_MASTER_WIZARDS, ...CONSTRUCTION_SYSTEM_MAIN_WIZARDS];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *
	 * @return An array of objects that provide some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('main', () => import('@libs/constructionsystem/main').then((module) => module.ConstructionsystemMainModule)),
			ContainerModuleRouteInfo.create('common', () => import('@libs/constructionsystem/common').then((module) => module.ConstructionsystemCommonModule)),
			ContainerModuleRouteInfo.create('master', () => import('@libs/constructionsystem/master').then((module) => module.ConstructionsystemMasterModule)),
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
