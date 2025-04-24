/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
	ISubModuleRouteInfo,
	ITile,
	ModulePreloadInfoBase,
	PlatformModuleManagerService,
	TileGroup,
	TileSize
} from '@libs/platform/common';
import { ControllingPreloadInfo } from './model/controlling-preload-info.class';
import {ContainerModuleRouteInfo} from '@libs/ui/container-system';

/**
 * This class initializes the `controlling` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class ControllingPreloadModule extends ModulePreloadInfoBase {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(ControllingPreloadInfo.instance);
		super();
	}

	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'controlling.configuration',
				displayName: {
					text: 'Controlling Configuration',
					key: 'cloud.desktop.moduleDisplayNameControllingConfiguration',
				},
				description: {
					text: 'Controlling Configuration',
					key: 'cloud.desktop.moduleDisplayNameControllingConfiguration',
				},
				iconClass: 'ico-controlling-configuration',
				tileSize: TileSize.Small,
				defaultSorting: 1,
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				defaultGroupId: TileGroup.Configuration,
				permissionGuid: '6c9906e05bc94b89938503be06be3216',
				targetRoute: 'controlling/configuration',
			}
		];
	}

	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('configuration', () => import('@libs/controlling/configuration').then((module) => module.ControllingConfigurationModule)),
			ContainerModuleRouteInfo.create('generalcontractor', () => import('@libs/controlling/generalcontractor').then((module) => module.ControllingGeneralcontractorModule)),
			];
	}

	public override get internalModuleName(): string {
		return 'controlling';
	}
}
