/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IEditorPanels, UiContainerSystemMainViewService } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { ResourceTypeModuleInfo} from './model/resource-type-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';

const routes: Routes = [new BusinessModuleRoute(ResourceTypeModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers: [
	],
})
export class ResourceTypeModule {
	/**
	 * Initializes the timekeeping payment group module and sets the ui with the required layout.
	 * @param uiService
	 */
	public constructor(uiService: UiContainerSystemMainViewService) {

		uiService.layoutId.next('layout2');
		const panelInfo: IEditorPanels[] = [
			{
				panel: [{
					content: ['b881141e03c14ddfb1aa965c0cb9ea2c'],
					pane: 'pane-l'
				}]
			},
			{
				panel: [{
					content: ['a0b5aa1be8524f48b1796a06b9ce3e77'],
					pane: 'pane-m'
				}]
			},
			{
				panel: [{
					content: ['02941383fd24429f9ba46df30b2f6d6c'],
					pane: 'pane-r'
				},{
					content: ['a6e1e8208327420f85aa92585f851aee'],
					pane: 'pane-r'
				}]
			}
		];
		uiService.panelInfo = panelInfo;
	}
}
