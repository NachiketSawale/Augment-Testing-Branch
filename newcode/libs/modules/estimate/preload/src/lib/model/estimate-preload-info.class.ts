import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, TileGroup, IWizard } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { ESTIMATE_ASSEMBLIES_WIZARDS, ESTIMATE_MAIN_WIZARDS } from './wizards/estimate-preload-wizard';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';

/**
 * The module info object for the `estimate` preload module.
 */
export class EstimatePreloadInfo extends ModulePreloadInfoBase {
	private static _instance?: EstimatePreloadInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): EstimatePreloadInfo {
		if (!this._instance) {
			this._instance = new EstimatePreloadInfo();
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
		return 'estimate';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'estimate.assemblies',
				displayName: {
					text: 'Assemblies',
					key: 'cloud.desktop.moduleDisplayNameEstimateAssemblies',
				},
				description: {
					text: 'Estimate Assemblies',
					key: 'cloud.desktop.moduleDescriptionEstimateAssemblies',
				},
				iconClass: 'ico-estimate-assemblies',
				color: 2722769,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'estimate/assemblies',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: '92e4316d039c408985426795c8a63ff5',
			},
			{
				id: 'estimate.common',
				displayName: {
					text: 'estimate common',
					key: '',
				},
				description: {
					text: 'Sample description',
					key: '',
				},
				iconClass: 'ico-rib-logo',
				color: 0x00ecbb,
				opacity: 0.9,
				textColor: 0x001914,
				iconColor: 0x001914,
				tileSize: TileSize.Small,
				targetRoute: 'estimate/common',
				defaultGroupId: TileGroup.MasterData, //TODO
				defaultSorting: 0, //TODO
				permissionGuid: '',
			},
			{
				id: 'estimate.main',
				displayName: {
					text: 'Estimate',
					key: 'cloud.desktop.moduleDisplayNameEstimate',
				},
				description: {
					text: 'Estimate',
					key: 'cloud.desktop.moduleDescriptionEstimate',
				},
				iconClass: 'ico-estimate',
				color: 3054335,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'estimate/main',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '9c75837423b14673a4f9890b27deca79',
			},
			{
				id: 'estimate.parameter',
				displayName: {
					text: 'estimate parameter',
					key: '',
				},
				description: {
					text: 'Sample description',
					key: '',
				},
				iconClass: 'ico-rib-logo',
				color: 0x00ecbb,
				opacity: 0.9,
				textColor: 0x001914,
				iconColor: 0x001914,
				tileSize: TileSize.Small,
				targetRoute: 'estimate/parameter',
				defaultGroupId: TileGroup.MasterData, //TODO
				defaultSorting: 0, //TODO
				permissionGuid: '',
			},
			{
				id: 'estimate.project',
				displayName: {
					text: 'estimate project',
					key: '',
				},
				description: {
					text: 'Sample description',
					key: '',
				},
				iconClass: 'ico-rib-logo',
				color: 0x00ecbb,
				opacity: 0.9,
				textColor: 0x001914,
				iconColor: 0x001914,
				tileSize: TileSize.Small,
				targetRoute: 'estimate/project',
				defaultGroupId: TileGroup.MasterData, //TODO
				defaultSorting: 0, //TODO
				permissionGuid: '',
			},
			{
				id: 'estimate.rule',
				displayName: {
					text: 'Rules Definition Master',
					key: 'cloud.desktop.moduleDisplayNameRuleDefinitionMaster',
				},
				description: {
					text: '',
					key: 'cloud.desktop.moduleDescriptionRuleDefinitionMaster',
				},
				iconClass: 'ico-estimate-rules',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'estimate/rule',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 0, //TODO
				permissionGuid: 'e21676358ee643fb8dd837651a478898',
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
			ContainerModuleRouteInfo.create('assemblies', () => import('@libs/estimate/assemblies').then((module) => module.EstimateAssembliesModule)),
			ContainerModuleRouteInfo.create('common', () => import('@libs/estimate/common').then((module) => module.EstimateCommonModule)),
			ContainerModuleRouteInfo.create('main', () => import('@libs/estimate/main').then((module) => module.EstimateMainModule)),
			ContainerModuleRouteInfo.create('parameter', () => import('@libs/estimate/parameter').then((module) => module.EstimateParameterModule)),
			ContainerModuleRouteInfo.create('project', () => import('@libs/estimate/project').then((module) => module.EstimateProjectModule)),
			ContainerModuleRouteInfo.create('rule', () => import('@libs/estimate/rule').then((module) => module.EstimateRuleModule)),
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

	/**
	 * Retrieves the wizards available for managing the estimate.
	 * @returns {IWizard[] | null} An array containing the available wizards,
	 * or null if no wizards are available.
	 */
	public override get wizards(): IWizard[] | null {
		return [...ESTIMATE_MAIN_WIZARDS,
			...ESTIMATE_ASSEMBLIES_WIZARDS
		];
	}
}
