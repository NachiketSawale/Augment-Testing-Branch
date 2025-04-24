/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContainerTestHostComponent } from '@libs/ui/container-system';
import { ExampleTopicOneModuleInfo } from './model/example-topic-one-module-info.class';
import { AContainerComponent } from './components/a-container/a-container.component';
import { BContainerComponent } from './components/b-container/b-container.component';
import { HcwViewerComponent } from './components/hcw-viewer/hcw-viewer.component';
import { FormsModule } from '@angular/forms';
import { ModalClickComponent } from './components/modal-dialog-click/modal-click.component';
import { SaveComponent } from './components/modal-dialog-body/save/save.component';
import { ChangePasswordComponent } from './components/modal-dialog-body/changepassword/changepassword.component';
import { AlertComponent } from './components/modal-dialog-body/alert/alert.component';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { WizardListContainerComponent } from './components/wizard-list-container/wizard-list-container.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { UiMapModule } from '@libs/ui/map';
import { DemoMapComponent } from './components/demo-map/demo-map.component';
import { SidebarDemoComponent } from './components/sidebar-demo/sidebar-demo.component';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { FormDialogContainerComponent } from './components/form-dialog-container/form-dialog-container.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { QuickstartTabComponent } from './components/quickstart-tab/quickstart-tab.component';
import { SaveStepComponent } from './components/multistep-container/save-step/save.component';
import { ChangePasswordStepComponent } from './components/multistep-container/changepassword-step/changepassword.component';
import { AlertStepComponent } from './components/multistep-container/alert-step/alert.component';
import { MultistepContainerComponent } from './components/multistep-container/multistep-container.component';
import { MasterDetailDialogContainerComponent } from './components/master-detail-dialog-container/master-detail-dialog-container.component';
import { OverlayDemoComponent } from './components/overlay-demo/overlay-demo.component';
import { BasicsSharedModule } from '@libs/basics/shared';
import { TelephoneDemoComponent } from './components/telephone-demo/telephone-demo.component';
import { AddressDemoComponent } from './components/address-demo/address-demo.component';
import { LookupDemoComponent } from './components/lookup-demo/lookup-demo.component';
import { GridDialogContainerComponent } from './components/grid-dialog-container/grid-dialog-container.component';
import { ScopedConfigDialogContainerComponent } from './components/scoped-config-dialog-container/scoped-config-dialog-container.component';
import { UserFormDemoComponent } from './components/user-form-demo/user-form-demo.component';
import { ListSelectionDialogContainerComponent } from './components/list-selection-dialog-container/list-selection-dialog-container.component';
import { SchedulerUiNotificationContainerComponent } from './components/scheduler-ui-notification-container/scheduler-ui-notification-container.component';
import { GridConfigDialogContainerComponent } from './components/grid-config-dialog-container/grid-config-dialog-container.component';
import { TextEditorContainerComponent } from './components/text-editor-container/text-editor-container.component';
import { PageableLongTextDialogContainerComponent } from './components/pageable-long-text-dialog-container/pageable-long-text-dialog-container.component';
import { LongTextDialogContainerComponent } from './components/long-text-dialog-container/long-text-dialog-container.component';
import { FormConfigDialogContainerComponent } from './components/form-config-dialog-container/form-config-dialog-container.component';
import { RuleEditorContainerComponent } from './components/rule-editor-container/rule-editor-container.component';

const routes: Routes = [
	{
		path: '',
		component: ContainerTestHostComponent,
		data: {
			moduleInfo: ExampleTopicOneModuleInfo.instance,
		},
		resolve: {
			moduleResolver: PlatformModuleManagerService,
		},
	},
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, FormsModule, PlatformCommonModule, NgxGraphModule, UiMapModule, BasicsSharedModule, GridComponent],
	declarations: [
		AContainerComponent,
		BContainerComponent,
		HcwViewerComponent,
		ModalClickComponent,
		SaveComponent,
		ChangePasswordComponent,
		AlertComponent,
		WizardListContainerComponent,
		SidebarDemoComponent,
		FormDialogContainerComponent,
		QuickstartTabComponent,
		OverlayDemoComponent,
		DemoMapComponent,
		MasterDetailDialogContainerComponent,
		TextEditorContainerComponent,
		SaveStepComponent,
		ChangePasswordStepComponent,
		AlertStepComponent,
		MultistepContainerComponent,
		TelephoneDemoComponent,
		AddressDemoComponent,
		LookupDemoComponent,
		GridDialogContainerComponent,
		ScopedConfigDialogContainerComponent,
		UserFormDemoComponent,
		ListSelectionDialogContainerComponent,
		GridConfigDialogContainerComponent,
		SchedulerUiNotificationContainerComponent,
		PageableLongTextDialogContainerComponent,
		LongTextDialogContainerComponent,
		FormConfigDialogContainerComponent,
		RuleEditorContainerComponent
	],
	exports: [],
})
export class ExampleTopicOneModule { }
