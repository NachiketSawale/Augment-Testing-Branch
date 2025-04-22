/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiDesktopPageComponent } from './desktop-page.component';
import { UiDesktopPagerComponent } from './components/desktop-pager/desktop-pager.component';
import { UiDesktopTileGroupComponent } from './components/tile-group/tile-group.component';
import { UiDesktopTileComponent } from './components/tile/tile.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { TranslatePipe } from '@libs/platform/common';
import { UiDesktopModuleInfo } from './models/ui-desktop-module-info.class';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { UiMainFrameModule } from '@libs/ui/main-frame';

const routes: Routes = [
	{
		path: '',
		component: UiDesktopPageComponent,
		data: {
			moduleInfo: new UiDesktopModuleInfo(),
		},
		children: [{
			path: ':type',
			component: UiDesktopPageComponent,
			data: {
				moduleInfo: new UiDesktopModuleInfo(),
			},
			resolve: {
				moduleResolver: PlatformModuleManagerService,
			},
		}],
		resolve: {
			moduleResolver: PlatformModuleManagerService,
		},
	},
];

@NgModule({
	imports: [
		CommonModule,
		PlatformCommonModule,
		UiMainFrameModule,
		RouterModule.forChild(routes),
	],
	declarations: [UiDesktopPageComponent, UiDesktopPagerComponent, UiDesktopTileGroupComponent, UiDesktopTileComponent],
	providers: [
		TranslatePipe,
	],
})
export class UiDesktopModule {
}
