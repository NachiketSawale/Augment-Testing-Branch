/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	ISubModuleRouteInfo,
	ITile,
	ModulePreloadInfoBase,
	TileGroup,
	TileSize,
} from '@libs/platform/common';

export class WebapiPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new WebapiPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'webapihelp';
	}


	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'webapihelp.webapi-help',
				tileSize: TileSize.Small,
				color: 0x00ecbb,
				opacity: 1,
				iconClass: 'ico-rib-logo',
				iconColor: 0x001914,
				textColor: 0x001914,
				displayName: {
					text: 'WebAPI-Help',
					key: '',
				},
				description: {
					text: 'WebAPI help.',
					key: '',
				},
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 10,
				permissionGuid: '713b7d2a532b43948197621ba89ad67a',
				targetRoute: 'webapihelp/webapi-help',
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
			{
				subModuleName: 'webapi-help',
				loadChildren: () => import('@libs/webapihelp/main').then((module) => module.WebapiHelpMainModule),
			}
		];
	}

}
