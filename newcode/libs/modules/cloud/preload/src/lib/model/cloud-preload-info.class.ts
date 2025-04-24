import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, TileGroup, IWizard } from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { CLOUD_TRRANSLATION_WIZARDS } from './wizards/cloud-translation-wizards';

/**
 * The module info object for the `cloud` preload module.
 */
export class CloudPreloadInfo extends ModulePreloadInfoBase {
	private static _instance?: CloudPreloadInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): CloudPreloadInfo {
		if (!this._instance) {
			this._instance = new CloudPreloadInfo();
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
		return 'cloud';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'cloud.translation',
				displayName: {
					text: 'Translation',
					key: 'cloud.desktop.moduleDisplayNameTranslation',
				},
				description: {
					text: 'Translation',
					key: 'cloud.desktop.moduleDescriptionTranslation',
				},
				iconClass: 'ico-translation',
				color: 9805597,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'cloud/translation',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '96febb2f571345529b83bb504c90d98c',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *
	 * @return An array of objects that provide some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [ContainerModuleRouteInfo.create('translation', () => import('@libs/cloud/translation').then((module) => module.CloudTranslationModule))];
	}

	/**
	 * Returns all lazy injectable providers from all sub-modules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}

	/**
	 * Retrieves the wizards available for managing the cloud translation.
	 * @returns {IWizard[] | null} An array containing the available wizards,
	 * or null if no wizards are available.
	 */
	public override get wizards(): IWizard[] | null{
		return [
			...CLOUD_TRRANSLATION_WIZARDS
		];
	}
}
