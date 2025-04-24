/*
 * Copyright(c) RIB Software GmbH
 */

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ExampleContainerLayoutDemoModuleInfo } from './model/example-container-layout-demo-module-info.class';
import { ContainerModuleRoute, IEditorPanels, UiContainerSystemMainViewService } from '@libs/ui/container-system';
import { BasicsClerkListComponent } from './components/clerk-list/clerk-list.component';

import { DemoImageViewerComponent } from './components/demo-image-viewer/demo-image-viewer.component';
import { UiCommonModule } from '@libs/ui/common';
import { BasicsClerkDetailComponent } from './components/clerk-detail/clerk-detail.component';

const routes: Routes = [new ContainerModuleRoute(ExampleContainerLayoutDemoModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	declarations: [
		DemoImageViewerComponent,
		BasicsClerkListComponent,
		BasicsClerkDetailComponent
	],
})
export class ExampleContainerLayoutDemoModule {
	public constructor(private uiService: UiContainerSystemMainViewService) {
		uiService.layoutId.next('layout1');
		const panelInfo: IEditorPanels[] = [
			{
				panel: [
					{
						content: ['f01193df20e34b8d917250ad17a433f1', 'c2dd899746024732aa0fc583526f04eb'],
						pane: 'pane-l',
					},
				],
			},
			{
				panel: [
					{
						content: ['8b10861ea9564d60ba1a86be7e7da568', '6122eee3bf1a41ce994e0f1e5c165850', 'dde598002bbf4a2d96c82dc927e3e578'],
						pane: 'pane-r',
					},
				],
			},
		];
		uiService.panelInfo = panelInfo;
	}
}
