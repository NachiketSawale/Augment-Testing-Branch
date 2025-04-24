/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiCommonModule } from '@libs/ui/common';
import { MainFrameComponent } from './main-frame.component';
import { UiMainFrameAppInfoHeaderComponent } from './components/app-info-header/app-info-header.component';
import { UiMainFrameHeaderComponent } from './components/header/header.component';
import { UiMainFrameMainMenuComponent } from './components/main-menu/main-menu.component';
import { UiMainFrameNotificationDisplayComponent } from './components/notification-display/notification-display.component';
import { UiMainFrameSessionInfoHeaderComponent } from './components/session-info-header/session-info-header.component';
import { UiSidebarModule } from '@libs/ui/sidebar';
import { PlatformCommonModule } from '@libs/platform/common';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		UiCommonModule,
		UiSidebarModule,
		PlatformCommonModule
	],
	declarations: [MainFrameComponent, UiMainFrameHeaderComponent, UiMainFrameAppInfoHeaderComponent, UiMainFrameNotificationDisplayComponent, UiMainFrameSessionInfoHeaderComponent, UiMainFrameMainMenuComponent],
})
export class UiMainFrameModule {
}

