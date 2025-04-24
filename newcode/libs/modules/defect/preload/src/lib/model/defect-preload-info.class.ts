import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, TileGroup, IWizard } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { createChangeFormDataStatusWizard } from '@libs/basics/shared';

/**
 * The module info object for the `defect` preload module.
 */
export class DefectPreloadInfo extends ModulePreloadInfoBase {
	private static _instance?: DefectPreloadInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): DefectPreloadInfo {
		if (!this._instance) {
			this._instance = new DefectPreloadInfo();
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
		return 'defect';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'defect.main',
				displayName: {
					text: 'Defect',
					key: 'cloud.desktop.moduleDisplayNameDefect',
				},
				description: {
					text: 'Management of Defects',
					key: 'cloud.desktop.moduleDescriptionDefectInfo',
				},
				iconClass: 'ico-defect-management',
				color: 30694,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'defect/main',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '3724063f81f54168b2603bc427567127',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *
	 * @return An array of objects that provide some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [ContainerModuleRouteInfo.create('main', () => import('@libs/defect/main').then((module) => module.DefectMainModule))];
	}

	/**
	 * Returns all lazy injectable providers from all sub-modules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}

	public override get wizards(): IWizard[] | null {
		return [
			{
				uuid: 'dbcb28d7b4f14f1ebf26577caddcddab',
				name: 'Synchronize BIM 360 issues to RIB 4.0',
				execute: (context) => {
					return import('@libs/defect/main').then((module) => new module.DefectMainWizards().syncBim360Issues(context));
				},
			},
			{
				uuid: '2E593341E96C41079F9A8EC357B0F04E',
				name: 'Change Defect Status',
				execute: (context) => {
					return import('@libs/defect/main').then((module) => new module.DefectMainWizards().changeDefectStatus(context));
				}
			},
			createChangeFormDataStatusWizard('756badc830b74fdcbf6b6ddc3f92f7bd'),
			{
				uuid: 'e9084056c1a6410fba1d8dca3961b4d6',
				name: 'Create New Change From Defect',
				execute: (context) => {
					return import('@libs/defect/main').then((module) => new module.DefectMainWizards().createNewChangeFromDefect(context));
				},
			},
		];
	}
}
