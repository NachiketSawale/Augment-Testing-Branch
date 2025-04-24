/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
// // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { IQuickstartTabSettings,UiSidebarQuickstartDataHandlingService } from '@libs/ui/sidebar';
import { ContainerBaseComponent } from '@libs/ui/container-system';

/**
 * Quickstart demo component
 */
@Component({
	selector: 'example-topic-one-quickstart-tab',
	templateUrl: './quickstart-tab.component.html',
	styleUrls: ['./quickstart-tab.component.scss'],
})
export class QuickstartTabComponent extends ContainerBaseComponent {
	public showTabs: boolean = true;
	public showPages: boolean = true;
	private http = inject(HttpClient);
	private quickstartDataHandlingService = inject(UiSidebarQuickstartDataHandlingService);
	private configurationService = inject(PlatformConfigurationService);

	public onOkClick() {
		const settingsData: IQuickstartTabSettings = {
			quickstartSettings: {
				system: {
					showPages: this.showPages,
					showTabs: this.showTabs,
					changed: true,
				},
			},
			sidebarSettings: {
				sidebarSetting: []
			}
		};	
		this.http.post(this.configurationService.webApiBaseUrl + 'cloud/desktop/usersettings/save',settingsData).subscribe(() => {
			this.quickstartDataHandlingService.onSettingsChanged(settingsData);
		});
	}
}
