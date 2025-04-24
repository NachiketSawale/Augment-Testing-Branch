import { ITile, ModulePreloadInfoBase, ISubModuleRouteInfo, TileSize, TileGroup, LazyInjectableInfo, IWizard } from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { TRANSPORTPLANNING_PACKAGE_WIZARDS } from './wizards/transportplanning-package-wizards';
import { TRANSPORTPLANNING_BUNDLE_WIZARDS } from './wizards/transportplanning-bundle-wizards';

/**
 * The module info object for the `transportplanning` preload module.
 */
export class TransportplanningPreloadInfo extends ModulePreloadInfoBase {
	private static _instance?: TransportplanningPreloadInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TransportplanningPreloadInfo {
		if (!this._instance) {
			this._instance = new TransportplanningPreloadInfo();
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
		return 'transportplanning';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'transportplanning.transport',
				displayName: {
					text: 'Transport',
					key: 'cloud.desktop.moduleDisplayNameTransport',
				},
				description: {
					text: 'Management of Transport',
					key: 'cloud.desktop.moduleDescriptionTransport',
				},
				iconClass: 'ico-transport',
				color: 5221202,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'transportplanning/transport',
				defaultGroupId: TileGroup.ProductionPlanning, //TODO
				defaultSorting: 0, //TODO
				permissionGuid: '12ee6678e099463f84a3b67d66c5b77d',
			},
			{
				id: 'transportplanning.bundle',
				displayName: {
					text: 'Bundle',
					key: 'cloud.desktop.moduleDisplayNameBundle',
				},
				description: {
					text: 'Management of Bundle',
					key: 'cloud.desktop.moduleDescriptionBundle',
				},
				iconClass: 'ico-product-bundles',
				color: 3701306,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'transportplanning/bundle',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0,
				permissionGuid: '5f42108913fb4704bec7838102756a0c',
			},
			{
				id: 'transportplanning.package',
				displayName: {
					text: 'transportplanning package',
					key: 'cloud.desktop.moduleDisplayNameTrsPackage',
				},
				description: {
					text: 'Sample description',
					key: 'cloud.desktop.moduleDescriptionTrsPackage',
				},
				iconClass: 'ico-transport-package',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'transportplanning/package',
				defaultGroupId: TileGroup.ProductionPlanning,
				defaultSorting: 0, //TODO
				permissionGuid: '11f16234d3ec4999ae0316d88cac8f83',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *
	 * @return An array of objects that provide some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('transport', () => import('@libs/transportplanning/transport').then((module) => module.TransportplanningTransportModule)),
			ContainerModuleRouteInfo.create('bundle', () => import('@libs/transportplanning/bundle').then((module) => module.TransportplanningBundleModule)),
			ContainerModuleRouteInfo.create('package', () => import('@libs/transportplanning/package').then((module) => module.TransportplanningPackageModule)),
		];
	}

	/**
	 * Returns the wizards provided by the module.
	 *
	 * @return An array of wizards.
	 */
	public override get wizards(): IWizard[] | null {
		return [...TRANSPORTPLANNING_PACKAGE_WIZARDS, ...TRANSPORTPLANNING_BUNDLE_WIZARDS];
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
