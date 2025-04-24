
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ContainerModuleRoute, IEditorPanels, UiContainerSystemMainViewService } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { TimekeepingSettlementModuleInfo } from './model/timekeeping-settlement-module-info.class';
import { RouterModule, Routes } from '@angular/router';
/**
 * Adds a default route to render containers to timekeeping settlement module
 */
const routes: Routes = [
	new ContainerModuleRoute(TimekeepingSettlementModuleInfo.instance)
];

@NgModule({
	imports: [CommonModule, UiCommonModule, RouterModule.forChild(routes)],
	declarations: [],
	providers: []
})
export class TimekeepingSettlementModule {
	/**
	 * Initializes the timekeeping settlement module and sets the ui with the required layout.
	 * @param uiService
	 */
	public constructor(uiService: UiContainerSystemMainViewService) {
		uiService.layoutId.next('layout9');
		const panelInfo: IEditorPanels[] = [
			{
				panel: [
					{
						content: ['128de81cbbe945759306123364a20cb1'],
						pane: 'pane-l'
					}
				]
			},
			{
				panel: [
					{
						content: ['5608ca31f98343ee8fc34b832eabb893'],
						pane: 'pane-rt'
					}
				]
			},
			{
				panel: [
					{
						content: ['6f4303109d94448bb98e71852946e039'],
						pane: 'pane-rb'
					}
				]
			},
			{
				panel: [
					{
						content: ['643fbcea9f8a44df94c7483549af3ef0'],
						pane: 'pane-rt'
					}
				]
			}
		];
		uiService.panelInfo = panelInfo;
	}
}
