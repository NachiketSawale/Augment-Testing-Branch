import {
	ITile,
	ModulePreloadInfoBase,
	LazyInjectableInfo,
	ISubModuleRouteInfo,
	TileSize,
	TileGroup,
	IWizard, IInitializationContext
} from '@libs/platform/common';

import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { QTO_MAIN_WIZARDS } from './wizards/qto-main-wizards';

export class QtoPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new QtoPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'qto';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'qto.main',
				displayName: {
					text: 'QTO',
					key: 'cloud.desktop.moduleDisplayNameQTO',
				},
				description: {
					text: 'Quantity Take off',
					key: 'cloud.desktop.moduleDescriptionQTO',
				},
				iconClass: 'ico-qto',
				color: 3054335,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'qto/main',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '1bedc3a41faa4e84a08de5c7c3135f17',
			},
			{
				id: 'qto.formula',
				displayName: {
					text: 'QTO Formula',
					key: 'cloud.desktop.moduleDisplayNameQTOFormula',
				},
				description: {
					text: 'QTO Formula',
					key: 'cloud.desktop.moduleDescriptionQTOFormula',
				},
				iconClass: 'ico-qto-formula',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'qto/formula',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: 'cceb7438c381424d91029487b4018eed',
			},
		];
	}

	/**
	 * Returns all wizards provided by the module.
	 *
	 * @returns The array of wizard declarations.
	 */
	public override get wizards(): IWizard[] {
		return [
			...QTO_MAIN_WIZARDS,
			{
				uuid: '0940b54374e24089a26a1ac56d8a1dba',
				name: 'Renumber QTO Lines',
				description: 'Renumber QTO Lines',
				execute(context: IInitializationContext) {
					return import('@libs/qto/main').then((m) => {
						new m.QtoMainRenumberQtoLinesWizard(context).execute();
					});
				},
			},
		];
	}

	/**
	 * Returns some information on routes to all submodules in the module.
	 * @protected
	 *
	 * @return {Array<ISubModuleRouteInfo>} An array of objects that provides some information about the submodule routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('main', () => import('@libs/qto/main').then((module) => module.ModulesQtoMainModule)),
			ContainerModuleRouteInfo.create('formula', () => import('@libs/qto/formula').then((module) => module.QtoFormulaModule)),
		];
	}

	/**
	 * Returns all lazy injectable providers from all submodules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}
}
