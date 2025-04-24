/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule, TranslatePipe } from '@libs/platform/common';

import { UiSidebarChatbotSidebarTabComponent } from './components/chatbot-sidebar-tab/chatbot-sidebar-tab.component';
import { UiSidebarFavoritesSidebarTabComponent } from './components/favorites-sidebar/favorites-sidebar-tab/favorites-sidebar-tab.component';
import { UiSidebarFavoritesSidebarMainComponent } from './components/favorites-sidebar/favorites-sidebar-main/favorites-sidebar-main.component';
import { UiSidebarFavoritesSidebarEditComponent } from './components/favorites-sidebar/favorites-sidebar-edit/favorites-sidebar-edit.component';
import { UiSidebarHistorySidebarTabComponent } from './components/history-sidebar-tab/history-sidebar-tab.component';
import { UiSidebarQuickstartSidebarTabComponent } from './components/quickstart-sidebar-tab/quickstart-sidebar-tab.component';
import { UiSidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarContentComponent } from './components/sidebar-content/sidebar-content.component';
import { UiSidebarReportTabComponent } from './components/report-sidebar/report-sidebar-tab/report-sidebar-tab.component';
import { UiSidebarWizardsSidebarTabComponent } from './components/wizards-sidebar-tab/wizards-sidebar-tab.component';
import { UiSidebarReportListComponent } from './components/report-sidebar/report-sidebar-list/report-sidebar-list.component';
import { UiSidebarReportParameterComponent } from './components/report-sidebar/report-sidebar-parameter/report-sidebar-parameter.component';
import { UiSidebarReportFormContainerComponent } from './components/report-sidebar/report-sidebar-form-container/report-sidebar-form-container.component';
import { UiSidebarSearchSidebarTabComponent } from './components/search-sidebar-tab/search-sidebar-tab.component';
import { UiSidebarContentNavbarComponent } from './components/sidebar-content-navbar/sidebar-content-navbar.component';
import { UiSidebarSimpleSearchComponent } from './components/simple-search/simple-search.component';
import { UiSidebarTaskSidebarTabComponent } from './components/task-sidebar-tab/task-sidebar-tab.component';
import {
	TaskSidebarSaveDialogComponent
} from './components/task-sidebar-tab/task-sidebar-save-dialog/task-sidebar-save-dialog.component';
import { UiSidebarWorkflowSidebarTabComponent } from './components/workflow-sidebar-tab/workflow-sidebar-tab.component';
import { UiSidebarTaskSidebarDetailComponent } from './components/task-sidebar-tab/task-sidebar-detail/task-sidebar-detail.component';
import {
	WorkflowSidebarDetailViewComponent
} from './components/workflow-sidebar-detail-view/workflow-sidebar-detail-view.component';
import {
	UiSidebarWorkflowTabPinComponent
} from './components/workflow-sidebar-tab-pin/workflow-sidebar-tab-pin.component';
import { UiSidebarNotificationComponent } from './components/sidebar-notification/sidebar-notification.component';
import { NotificationItemsComponent } from './components/sidebar-notification/notification-items/notification-items/notification-items.component';
import { SidebarTitleComponent } from './components/sidebar-title/sidebar-title.component';

@NgModule({
	imports: [CommonModule, UiCommonModule, PlatformCommonModule, FormsModule, DragDropModule, WorkflowSidebarDetailViewComponent, UiSidebarWorkflowTabPinComponent],
	declarations: [
		UiSidebarComponent,
		UiSidebarQuickstartSidebarTabComponent,
		UiSidebarHistorySidebarTabComponent,
		UiSidebarChatbotSidebarTabComponent,
		UiSidebarFavoritesSidebarMainComponent,
		UiSidebarFavoritesSidebarTabComponent,
		UiSidebarFavoritesSidebarEditComponent,
		SidebarContentComponent,
		UiSidebarReportTabComponent,
		UiSidebarWizardsSidebarTabComponent,
		UiSidebarReportListComponent,
		UiSidebarReportParameterComponent,
		UiSidebarReportFormContainerComponent,
		UiSidebarSearchSidebarTabComponent,
		UiSidebarSimpleSearchComponent,
		UiSidebarContentNavbarComponent,
		UiSidebarTaskSidebarTabComponent,
		TaskSidebarSaveDialogComponent,
		UiSidebarWorkflowSidebarTabComponent,
		UiSidebarTaskSidebarDetailComponent,
		UiSidebarNotificationComponent,
		NotificationItemsComponent,
		SidebarTitleComponent
	],
	exports: [
		UiSidebarComponent,
		UiSidebarQuickstartSidebarTabComponent,
		UiSidebarHistorySidebarTabComponent,
		UiSidebarFavoritesSidebarTabComponent,
		UiSidebarChatbotSidebarTabComponent,
		SidebarContentComponent,
		UiSidebarReportTabComponent,
		UiSidebarWizardsSidebarTabComponent,
		UiSidebarSearchSidebarTabComponent,
		UiSidebarTaskSidebarTabComponent
	],
	providers: [TranslatePipe],
})
export class UiSidebarModule { }
