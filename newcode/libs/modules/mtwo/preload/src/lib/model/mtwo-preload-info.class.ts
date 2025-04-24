/*
 * Copyright(c) RIB Software GmbH
 */

import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, TileGroup } from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';

/**
 * The module info object for the `mtwo` preload module.
 */
export class MtwoPreloadInfo extends ModulePreloadInfoBase {
	private static _instance?: MtwoPreloadInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): MtwoPreloadInfo {
		if (!this._instance) {
			this._instance = new MtwoPreloadInfo();
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
		return 'mtwo';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'mtwo.controltowerconfiguration',
				displayName: {
					text: 'Control Tower 4.0 Configuration',
					key: 'cloud.desktop.moduleDisplayNameControlTowerConfiguration',
				},
				description: {
					text: '',
					key: 'cloud.desktop.moduleDescriptionNameControlTowerConfiguration',
				},
				iconClass: 'ico-power-bi-config',
				color: 2974255,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'mtwo/controltowerconfiguration',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '9c8f22b66d3741f497f0c65c1e423fba',
			},
			{
				id: 'mtwo.controltower',
				displayName: {
					text: 'Control Tower 4.0',
					key: 'cloud.desktop.moduleDisplayNameControlTower',
				},
				description: {
					text: 'Powered by PowerBI',
					key: 'cloud.desktop.moduleDescriptionNameControlTower',
				},
				iconClass: 'ico-power-bi-control-tower',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'mtwo/controltower',
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 0, //TODO
				permissionGuid: 'a630121a3b7e4cab9a1d19c9769b5cfe',
			}
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *
	 * @return An array of objects that provide some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('controltowerconfiguration', () => import('@libs/mtwo/controltowerconfiguration').then((module) => module.MtwoControltowerConfigurationModule)),
			ContainerModuleRouteInfo.create('controltower', () => import('@libs/mtwo/controltower').then((module) => module.MtwoControltowerModule))
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
