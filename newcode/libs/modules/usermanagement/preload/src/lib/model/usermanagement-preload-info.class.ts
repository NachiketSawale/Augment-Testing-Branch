import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, TileGroup, IWizard } from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { UERMANAGEMENT_RIGHT_WIZARDS } from './wizards/usermanagement-right-wizards';

/**
 * The module info object for the `usermanagement` preload module.
 */
export class UsermanagementPreloadInfo extends ModulePreloadInfoBase {

	/**
	 * Returns the singleton instance of the class.
	 */
	public static readonly instance = new UsermanagementPreloadInfo();

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
		return 'usermanagement';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'usermanagement.group',
				displayName: {
					text: 'undefined',
					key: 'cloud.desktop.moduleDisplayNameUsermanagementGroup',
				},
				description: {
					text: 'undefined',
					key: 'cloud.desktop.moduleDescriptionNameUsermanagementGroup',
				},
				iconClass: 'ico-groups',
				color: 16745503,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'usermanagement/group',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: 'fd0adc533db44e8988f3dc24ad6faf5c',

			},{
				id: 'usermanagement.user',
				displayName: {
					key: 'cloud.desktop.moduleDisplayNameUsermanagementUser',
				},
				description: {
					key: 'cloud.desktop.moduleDescriptionNameUsermanagementUser',
				},
				iconClass: 'ico-users',
				color: 16412672,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'usermanagement/user',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '9d145282d2da4ebbaacbb2947131b508',
			},
			{
				id: 'usermanagement.right',
				displayName: {
					text: 'Roles',
					key: 'cloud.desktop.moduleDisplayNameUsermanagementRight',
				},
				description: {
					text: 'undefined',
					key: 'cloud.desktop.moduleDescriptionNameUsermanagementRight',
				},
				iconClass: 'ico-access-rights',
				color: 16750402,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'usermanagement/right',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '8e8fc54a953e47938c889d5ab14596a4',
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
			ContainerModuleRouteInfo.create('group', () => import('@libs/usermanagement/group').then((module) => module.UsermanagementGroupModule)),
			ContainerModuleRouteInfo.create('user', () => import('@libs/usermanagement/user').then((module) => module.UsermanagementUserModule)),
			ContainerModuleRouteInfo.create('right', () => import('@libs/usermanagement/right').then((module) => module.UsermanagementRightModule)),
		];
	}

	/**
	 * Returns all wizards provided by the module.
	 *
	 * @returns The array of wizard declarations.
	 */
	public override get wizards(): IWizard[] | null {
		return [
				...UERMANAGEMENT_RIGHT_WIZARDS
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
