/*
 * Copyright(c) RIB Software GmbH
 */

import { ContainerModuleInfoBase, ContainerDefinition, GridContainerComponent, FormContainerComponent } from '@libs/ui/container-system';
import { AContainerComponent } from '../components/a-container/a-container.component';
import { BContainerComponent } from '../components/b-container/b-container.component';
import { HcwViewerComponent } from '../components/hcw-viewer/hcw-viewer.component';
import { ModalClickComponent } from '../components/modal-dialog-click/modal-click.component';
import { WizardListContainerComponent } from '../components/wizard-list-container/wizard-list-container.component';
import { DemoMapComponent } from '../components/demo-map/demo-map.component';
import { delay, firstValueFrom, of } from 'rxjs';
import { QuickstartTabComponent } from '../components/quickstart-tab/quickstart-tab.component';
import { SidebarDemoComponent } from '../components/sidebar-demo/sidebar-demo.component';
import { FormDialogContainerComponent } from '../components/form-dialog-container/form-dialog-container.component';
import { MultistepContainerComponent } from '../components/multistep-container/multistep-container.component';
import { MasterDetailDialogContainerComponent } from '../components/master-detail-dialog-container/master-detail-dialog-container.component';
import { OverlayDemoComponent } from '../components/overlay-demo/overlay-demo.component';
import { TelephoneDemoComponent } from '../components/telephone-demo/telephone-demo.component';
import { AddressDemoComponent } from '../components/address-demo/address-demo.component';
import { LookupDemoComponent } from '../components/lookup-demo/lookup-demo.component';
import { GridDialogContainerComponent } from '../components/grid-dialog-container/grid-dialog-container.component';
import { ScopedConfigDialogContainerComponent } from '../components/scoped-config-dialog-container/scoped-config-dialog-container.component';
import { UserFormDemoComponent } from '../components/user-form-demo/user-form-demo.component';
import { ListSelectionDialogContainerComponent } from '../components/list-selection-dialog-container/list-selection-dialog-container.component';
import { SchedulerUiNotificationContainerComponent } from '../components/scheduler-ui-notification-container/scheduler-ui-notification-container.component';
import { GridConfigDialogContainerComponent } from '../components/grid-config-dialog-container/grid-config-dialog-container.component';
import { TextEditorContainerComponent } from '../components/text-editor-container/text-editor-container.component';
import { PageableLongTextDialogContainerComponent } from '../components/pageable-long-text-dialog-container/pageable-long-text-dialog-container.component';
import { LongTextDialogContainerComponent } from '../components/long-text-dialog-container/long-text-dialog-container.component';
import { FormConfigDialogContainerComponent } from '../components/form-config-dialog-container/form-config-dialog-container.component';
import { RuleEditorContainerComponent } from '../components/rule-editor-container/rule-editor-container.component';

export class ExampleTopicOneModuleInfo extends ContainerModuleInfoBase {
	public static readonly instance = new ExampleTopicOneModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'example.topic-one';
	}

	protected override get containers(): ContainerDefinition[] {
		return [
			new ContainerDefinition(
				'3c3966045d574dcab3b8c53130b4c480',
				{
					text: 'Test A',
				},
				AContainerComponent,
				'dfdd06a581624d11ab1e6aa1103e76e2',
			),
			new ContainerDefinition(
				'3d5c91da4d144a4ab30777df6ed0806e',
				{
					text: 'Test B',
				},
				function () {
					return firstValueFrom(of(null).pipe(delay(5000))).then(() => BContainerComponent);
				},
				'dfdd06a581624d11ab1e6aa1103e76e2',
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034214',
				{
					text: 'text-editor',
				},
				TextEditorContainerComponent,
			),
			new ContainerDefinition(
				'dfdd06a581624d11ab1e6aa1103e76e2',
				{
					text: 'Grid',
				},
				GridContainerComponent,
				'dfdd06a581624d11ab1e6aa1103e76e2',
			),
			new ContainerDefinition(
				'385404d1db56432aba85aa34fc034554',
				{
					text: 'Detail',
				},
				FormContainerComponent,
				'dfdd06a581624d11ab1e6aa1103e76e2',
			),
			new ContainerDefinition(
				'580ad6fa6da9486abb5e55374b505f63',
				{
					text: 'Wizards List',
				},
				WizardListContainerComponent,
				'dfdd06a581624d11ab1e6aa1103e76e2',
			),
			new ContainerDefinition(
				'dfdd06a581624d11ab1e6aa1103e76e2',
				{
					text: '3D Viewer',
				},
				HcwViewerComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034214',
				{
					text: 'modal-dialog',
				},
				ModalClickComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034224',
				{
					text: 'sidebar',
				},
				SidebarDemoComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034214',
				{
					text: 'form-dialog',
				},
				FormDialogContainerComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034227',
				{
					text: 'quickstart',
				},
				QuickstartTabComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034235',
				{
					text: 'map',
				},
				DemoMapComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034214',
				{
					text: 'multistep-dialog',
				},
				MultistepContainerComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034228',
				{
					text: 'overlay',
				},
				OverlayDemoComponent,
			),

			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034214',
				{
					text: 'master-detail-dialog',
				},
				MasterDetailDialogContainerComponent,
			),
			new ContainerDefinition(
				'4ded6f2e02a34d848d589ccbb9e8b5e0',
				{
					text: 'Telephone Dialog',
				},
				TelephoneDemoComponent,
				'dfdd06a581624d11ab1e6aa1103e76e2',
			),
			new ContainerDefinition(
				'4ded6f2e02a34d848d589ccbb9e8b5e0',
				{
					text: 'Address Dialog',
				},
				AddressDemoComponent,
				'dfdd06a581624d11ab1e6aa1103e76e2',
			),
			new ContainerDefinition(
				'4ded6f2e02a34d848d589ccbb9e8b5e0',
				{
					text: 'Lookup Demo',
				},
				LookupDemoComponent,
				'dfdd06a581624d11ab1e6aa1103e76e2',
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034228',
				{
					text: 'Grid Dialog',
				},
				GridDialogContainerComponent,
			),
			new ContainerDefinition(
				'4ded6f2e02a34d848d589ccbb9e8b5e0',
				{
					text: 'User Form',
				},
				UserFormDemoComponent,
				'dfdd06a581624d11ab1e6aa1103e76e2',
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034228',
				{
					text: 'Scoped Config Dialog',
				},
				ScopedConfigDialogContainerComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034228',
				{
					text: 'List Selection Dialog',
				},
				ListSelectionDialogContainerComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034228',
				{
					text: 'Grid Config Dialog',
				},
				GridConfigDialogContainerComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034228',
				{
					text: 'Pageable long text dialog'
				},
				PageableLongTextDialogContainerComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034228',
				{
					text: 'scheduler notification demo'
				},
				SchedulerUiNotificationContainerComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034228',
				{
					text: 'Long text dialog'
				},
				LongTextDialogContainerComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034228',
				{
					text: 'Form config dialog'
				},
				FormConfigDialogContainerComponent,
			),
			new ContainerDefinition(
				'3777e04d1db56432adf85aa34fc034228',
				{
					text: 'Rule Editor'
				},
				RuleEditorContainerComponent
			)
		];
	}

	public override get preloadedTranslations(): string[] {
		return ['cloud.common', 'basics.common', 'cloud.desktop', 'platform.common'];
	}
}
