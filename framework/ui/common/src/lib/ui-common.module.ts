/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { OverlayModule } from '@angular/cdk/overlay';
import { UiCommonItemListComponent } from './components/item-list/components/item-list/item-list.component';
import { UiCommonItemListTreeComponent } from './components/item-list/components/item-list-tree/item-list-tree.component';
import { UiCommonAccordionListComponent } from './components/item-list/components/accordion-list/accordion-list.component';
import { UiCommonItemListTreeAccordionContentComponent } from './components/item-list/components/item-list-tree-accordion-content/item-list-tree-accordion-content.component';
import { UiCommonItemListTreeAccordionHeaderComponent } from './components/item-list/components/item-list-tree-accordion-header/item-list-tree-accordion-header.component';
import { UiCommonGroupedItemListComponent } from './components/item-list/components/grouped-item-list/grouped-item-list.component';
import { UiCommonGroupedAccordionListComponent } from './components/item-list/components/grouped-accordion-list/grouped-accordion-list.component';
import { UiCommonTooltipPopupTemplateComponent } from './components/tooltip/components/tooltip-popup-template/tooltip-popup-template.component';
import { UiCommonStyleEditor2Component } from './components/style-editor/components/style-editor2/style-editor2.component';
import { UiCommonStatusBarContentComponent } from './components/status-bar/components/status-bar-content/status-bar-content.component';
import { UiCommonStatusBarElementComponent } from './components/status-bar/components/status-bar-element/status-bar-element.component';
import { UiCommonStatusBarComponent } from './components/status-bar/components/status-bar/status-bar.component';
import { UiCommonCodeConverterDirective } from './components/input-controls/directives/code-converter.directive';
import { SelectOnFocusDirective } from './components/input-controls/directives/select-on-focus.directive';
import { ColourConverterDirective } from './components/input-controls/directives/colour-converter.directive';
import { IbanConverterDirective } from './components/input-controls/directives/iban-converter.directive';
import { UiCommonDropdownButtonComponent } from './components/dropdown-button/components/dropdown-button/dropdown-button.component';
import { FormValidationDirective } from './components/input-controls/directives/form-validation.directive';

import { UiCommonPopupComponent } from './popup/components/popup/popup.component';
import { UiCommonPopupContainerComponent } from './popup/components/popup-container/popup-container.component';
import { UiCommonPopupResizableDirective } from './popup/directives/popup-resizable.directive';
import { uiCommonLookupNullablePipe } from './lookup/pipes/lookup-nullable.pipe';
import { UiCommonLookupButtonPipe } from './lookup/pipes/lookup-button.pipe';
import { UiCommonLookupContentPipe } from './lookup/pipes/lookup-content.pipe';
import { UiCommonLookupButtonComponent } from './lookup/components/lookup-button/lookup-button.component';
import { UiCommonLookupInputComponent } from './lookup/components/lookup-input/lookup-input.component';
import { UiCommonLookupInputSelectComponent, UiCommonLookupMultipleInputComponent, UiCommonParentChildLookupDialogComponent } from './lookup';
import { UiCommonLookupInputTestComponent } from './lookup/components/lookup-input-test/lookup-input-test.component';
import { UiCommonComboPopupViewComponent } from './lookup/components/combo-popup-view/combo-popup-view.component';
import { UiCommonGridPopupViewComponent } from './lookup/components/grid-popup-view/grid-popup-view.component';
import { UiCommonGridDialogViewComponent } from './lookup/components/grid-dialog-view/grid-dialog-view.component';
import { UiCommonLookupCompositeComponent } from './lookup/components/lookup-composite/lookup-composite.component';
import { FormComponent } from './form/components/form/form.component';
import { CheckBoxComponent } from './domain-controls/components/check-box/check-box.component';
import { FileSelectComponent } from './domain-controls/components/file-select/file-select.component';
import { DateComponent } from './domain-controls/components/date/date.component';
import { DatepickerComponent } from './domain-controls/components/date/datepicker/datepicker.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DebounceChangeDirective } from './directives/ng-model-debounce.directive';

import { MenuListComponent } from './components/menu-list/menu-list/menu-list.component';

import { MenuListBtnComponent } from './components/menu-list/menu-list-btn/menu-list-btn.component';
import { UiCommonMenuListSideBarDropdownComponent } from './components/menu-list-old/menu-list-sidebar-dropdown/menu-list-sidebar-dropdown.component';
import { UiCommonMenulistEditViewComponent } from './components/menu-list-old/menulist-edit-view/menulist-edit-view.component';

import { MenuListCheckComponent } from './components/menu-list/menu-list-check/menu-list-check.component';
import { MenuListDropdownComponent } from './components/menu-list/menu-list-dropdown/menu-list-dropdown.component';
import { MenuListRadioComponent } from './components/menu-list/menu-list-radio/menu-list-radio.component';
import { MenuListOverflowComponent } from './components/menu-list/menu-list-overflow/menu-list-overflow.component';
import { MenuListActionSelectBtnComponent } from './components/menu-list/menu-list-action-select-btn/menu-list-action-select-btn.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UiCommonSafeHtmlPipe } from './dialogs/base/pipes/safe-html.pipe';
import { DialogDraggableDirective } from './dialogs/base/directives/dialog-draggable.directive';
import { DialogResizableDirective } from './dialogs/base/directives/dialog-resizable.directive';
import { ModalDialogWindowComponent } from './dialogs/base/components/modal-dialog-window/modal-dialog-window.component';
import { ModalHeaderComponent } from './dialogs/base/components/modal-header/modal-header.component';
import { ModalFooterComponent } from './dialogs/base/components/modal-footer/modal-footer.component';
import { ModalBodyComponent } from './dialogs/base/components/modal-body/modal-body.component';
import { DialogBodyDescriptionComponent } from './dialogs/base/components/dialog-body-description/dialog-body-description.component';
import { ModalBodyInputComponent } from './dialogs/input/components/modal-body-input/modal-body-input.component';
import { UiCommonAlarmOverlayComponent } from './dialogs/base/components/alarm-overlay/alarm-overlay.component';
import { MessageBoxComponent } from './dialogs/msgbox/components/message-box/message-box.component';
import { StepComponent } from './dialogs/multistep/components/step/step.component';
import { StepFormComponent } from './dialogs/multistep/components/step-form/step-form.component';
import { StepGridComponent } from './dialogs/multistep/components/step-grid/step-grid.component';
import { StepperComponent } from './dialogs/multistep/components/stepper/stepper.component';
import { UiCommonTabsComponent } from './dialogs/multistep/components/tabs/ui-common-tabs.component';
import { MultistepDialogComponent } from './dialogs/multistep/components/multistep-dialog/multistep-dialog.component';
import { UiCommonAccordionComponent } from './accordion/components/accordion/accordion.component';
import { UiCommonAccordionTestComponent } from './accordion/components/accordion-test/accordion-test.component';
import { UiCommonAccordionItemComponent } from './accordion/components/accordion-item/accordion-item.component';
import { UiCommonAccordionTreeComponent } from './accordion/components/accordion-tree/accordion-tree.component';
import { UiCommonAccordionItemContentComponent } from './accordion/components/accordion-item-content/accordion-item-content.component';
import { UiCommonAccordionItemActionsComponent } from './accordion/components/accordion-item-actions/accordion-item-actions.component';
import { PlatformCommonModule, TranslatePipe } from '@libs/platform/common';
import { FormSectionComponent } from './form/components/form-section/form-section.component';
import { PlatformDataAccessModule } from '@libs/platform/data-access';
import { CollapsableListDirective } from './directives/collapsable-list.directive';
import { MenuListPopupComponent } from './components/menu-list/menu-list-popup/menu-list-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UiCommonScriptEditorComponent, UiCommonScriptEditorTestComponent } from './script-editor';
import { UiCommonFilterScriptEditorComponent, UiCommonFilterScriptEditorTestComponent } from './selection-statement-editor';
import { ImageViewComponent } from './image-viewer/components/image-view/image-view.component';
import { ImageSizeDirective } from './image-viewer/directives/image-size.directive';
import { SvgImageDirective } from './directives/svg-image.directive';
import { CustomControlHostComponent } from './domain-controls/components/custom-control-host/custom-control-host.component';
import { HistoryComponent } from './domain-controls/components/history/history.component';
import { SingleLineTextComponent } from './domain-controls/components/single-line-text/single-line-text.component';
import { MultiLineTextComponent } from './domain-controls/components/multi-line-text/multi-line-text.component';
import { IntegerComponent } from './domain-controls/components/integer/integer.component';
import { FloatComponent } from './domain-controls/components/float/float.component';
import { PasswordComponent } from './domain-controls/components/password/password.component';
import { SelectComponent } from './domain-controls/components/select/select.component';
import { InputSelectComponent } from './domain-controls/components/input-select/input-select.component';
import { InputSelectPopupComponent } from './domain-controls/components/input-select-popup/input-select-popup.component';
import { DomainControlHostComponent } from './domain-controls/components/domain-control-host/domain-control-host.component';
import { ModalFormComponent } from './dialogs/form/components/modal-form/modal-form.component';
import { ColorPickerComponent } from './domain-controls/components/color-picker/color-picker.component';
import { TimeComponent } from './domain-controls/components/time/time.component';
import { UiCommonPopupMenuComponent } from './popup/components/popup-menu/popup-menu.component';
import { UiCommonPopupTestComponent } from './popup/components/popup-test/popup-test.component';
import { TranslationComponent } from './domain-controls/components/translation/translation.component';
import { CustomTranslateComponent } from './domain-controls/components/custom-translate/custom-translate.component';
import { RadioComponent } from './domain-controls/components/radio/radio.component';
import { CompositeComponent } from './domain-controls/components/composite/composite.component';
import { LookupHostComponent } from './domain-controls/components/lookup-host/lookup-host.component';
import { ResizableOverlayComponent } from './components/resizable-overlay/resizable-overlay.component';
import { ResizableOverlayContentComponent } from './components/resizable-overlay-content/resizable-overlay-content.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSliderModule } from '@angular/material/slider';
import { MasterDetailDialogComponent } from './dialogs/master-detail/component/master-detail-dialog/master-detail-dialog.component';
import { UiExternalModule } from '@libs/ui/external';
import { GridComponent } from './grid';
import { UiCommonLookupSelectComponent } from './lookup/components/lookup-select/lookup-select.component';
import { GridDialogComponent } from './dialogs/grid/components/grid-dialog/grid-dialog.component';
import { MissingComponent } from './domain-controls/components/missing/missing.component';
import { MenuListItemBaseComponent } from './model/menu-list/menu-list-base/menu-list-item-base.component';
import { UiCommonLoadingComponent } from './components/loading/loading.component';
import { ResizeObserverDirective } from './directives/resize-observer.directive';
import { MenuListFileSelectComponent } from './components/menu-list/menu-list-file-select/menu-list-file-select.component';
import { ScriptComponent } from './domain-controls';
import { UrlComponent } from './domain-controls/components/url/url.component';
import { LicencesDialogDetailComponent } from './dialogs/about/components/licences-dialog-detail/licences-dialog-detail.component';
import { CertificatesDialogDetailComponent } from './dialogs/about/components/certificates-dialog-detail/certificates-dialog-detail.component';
import { AboutDialogDetailComponent } from './dialogs/about/components/about-dialog-detail/about-dialog-detail.component';
import { QrCodeDetailComponent } from './dialogs/about/components/qr-code-detail/qr-code-detail.component';

import { ScopedConfigDialogComponent } from './dialogs/scoped-config/components/scoped-config-dialog/scoped-config-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { UiCommonSelectDialogOptionsComponent } from './test-dialog/components/select-dialog-options/select-dialog-options.component';
import { ListSelectionDialogComponent } from './dialogs/list-selection/components/list-selection-dialog/list-selection-dialog.component';
import { UiCommonGridDialogSearchFormComponent } from './lookup';
import { DynamicDomainControlComponent } from './domain-controls/components/dynamic-domain-control/dynamic-domain-control.component';
import { LookupInputSelectHostComponent } from './domain-controls/components/lookup-input-select-host/lookup-input-select-host.component';
import { UiCommonChartComponent } from './chart';
import { ActionComponent } from './domain-controls/components/action/action.component';
import { UiCommonChartEvalComponent } from './chart/components/chart-eval/chart-eval.component';
import { TabbedDialogComponent } from './dialogs/tabbed/components/tabbed-dialog/tabbed-dialog.component';
import { ImageSelectComponent } from './domain-controls/components/image-select/image-select.component';
import { ImageSelectPopupComponent } from './domain-controls/components/image-select/image-select-popup/image-select-popup.component';
import { DragDropTargetDirective } from './directives/drag-drop-target.directive';
import { MenuTabComponent } from './components/menu-tab/menu-tab.component';
import { QuillModule } from 'ngx-quill';
import { PageableLongTextDialogComponent } from './dialogs/pageable-long-text/components/pageable-long-text-dialog/pageable-long-text-dialog.component';
import { TextDisplayComponent } from './components/text-display/text-display.component';
import { LongTextDialogComponent } from './dialogs/long-text/components/long-text-dialog/long-text-dialog.component';
import { TextEditorComponent } from './text-editor/components/text-editor/text-editor.component';
import { TextEditorRulerComponent } from './text-editor/components/text-editor-ruler/text-editor-ruler.component';
import { UiCommonInfoBarComponent } from './components/infobar/component/info-bar.component';
import { UiCommonInputConfigDirective } from './input-config';
import { RuleEditorComponent } from './rule-editor/components/rule-editor/rule-editor.component';
import { ExpressionGroupComponent } from './rule-editor/components/expression-group/expression-group.component';
import { ExpressionComponent } from './rule-editor/components/expression/expression.component';
import { ExpressionOperandComponent } from './rule-editor/components/expression-operand/expression-operand.component';
import { ExpressionFieldSelectorComponent } from './rule-editor/components/expression-field-selector/expression-field-selector.component';
import { EntityFieldTreeSelectionComponent } from './rule-editor/components/entity-field-tree-selection/entity-field-tree-selection.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatListModule } from '@angular/material/list';
import { ExpressionOperatorComponent } from './rule-editor/components/expression-operator/expression-operator.component';
import { EnvironmentExpressionComponent } from './rule-editor/components/environment-expression/environment-expression.component';
import { VariableTimePeriodComponent } from './rule-editor/components/variable-time-period/variable-time-period.component';

const routes: Routes = [
	{
		path: 'grouped-accordion',
		component: UiCommonGroupedAccordionListComponent,
	},
	{
		path: 'grouped-item-list',
		component: UiCommonGroupedItemListComponent,
	},
	{
		path: 'accordion-header',
		component: UiCommonItemListTreeAccordionHeaderComponent,
	},
	{
		path: 'item-list-tree',
		component: UiCommonItemListTreeComponent,
	},
	{
		path: 'accordion-list',
		component: UiCommonAccordionListComponent,
	},
	{
		path: 'style-editor2',
		component: UiCommonStyleEditor2Component,
	},
	{
		path: 'tooltip',
		component: UiCommonTooltipPopupTemplateComponent,
	},
	{
		path: 'status-bar',
		component: UiCommonStatusBarComponent,
	},
	{
		path: 'lookup',
		component: UiCommonLookupInputTestComponent,
	},
	{
		path: 'accordion',
		component: UiCommonAccordionTestComponent,
	},
	{
		path: 'script-editor',
		component: UiCommonScriptEditorTestComponent,
	},
	{
		path: 'selection-statement-editor',
		component: UiCommonFilterScriptEditorTestComponent,
	},
	{
		path: 'popup',
		component: UiCommonPopupTestComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		RouterModule.forChild(routes),
		QuillModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		OverlayModule,
		MatButtonToggleModule,
		MatExpansionModule,
		MatCardModule,
		PlatformCommonModule,
		PlatformDataAccessModule,
		MatIconModule,
		MatButtonModule,
		MatDialogModule,
		MatPaginatorModule,
		MatSliderModule,
		UiExternalModule,
		GridComponent,
		MatTabsModule,
		MatTabsModule,
		MatTreeModule,
		MatListModule
	],
	providers: [DatePipe, MatDatepickerModule, TranslatePipe],
	declarations: [
		UiCommonSafeHtmlPipe,
		UiCommonItemListTreeComponent,
		UiCommonItemListTreeAccordionHeaderComponent,
		UiCommonItemListTreeAccordionContentComponent,
		UiCommonItemListComponent,
		UiCommonAccordionListComponent,
		UiCommonGroupedItemListComponent,
		UiCommonGroupedAccordionListComponent,
		UiCommonTooltipPopupTemplateComponent,
		UiCommonStyleEditor2Component,
		UiCommonStatusBarContentComponent,
		UiCommonStatusBarElementComponent,
		UiCommonStatusBarComponent,
		UiCommonCodeConverterDirective,
		SelectOnFocusDirective,
		ColourConverterDirective,
		IbanConverterDirective,
		UiCommonDropdownButtonComponent,
		UiCommonMenuListSideBarDropdownComponent,
		UiCommonMenulistEditViewComponent,
		FormValidationDirective,
		UiCommonPopupComponent,
		UiCommonPopupContainerComponent,
		UiCommonPopupResizableDirective,
		UiCommonPopupMenuComponent,
		UiCommonPopupTestComponent,
		uiCommonLookupNullablePipe,
		UiCommonLookupButtonPipe,
		UiCommonLookupContentPipe,
		UiCommonLookupButtonComponent,
		UiCommonLookupInputComponent,
		UiCommonLookupInputSelectComponent,
		UiCommonLookupMultipleInputComponent,
		UiCommonLookupInputTestComponent,
		UiCommonComboPopupViewComponent,
		UiCommonGridPopupViewComponent,
		UiCommonGridDialogViewComponent,
		UiCommonLookupCompositeComponent,
		FormComponent,
		FormSectionComponent,
		CheckBoxComponent,
		FileSelectComponent,
		DateComponent,
		DatepickerComponent,
		DebounceChangeDirective,

		MenuListItemBaseComponent,

		MenuListComponent,
		MenuListBtnComponent,
		TextEditorComponent,
		TextEditorRulerComponent,
		UiCommonParentChildLookupDialogComponent,

		UrlComponent,
		MenuListCheckComponent,
		MenuListDropdownComponent,
		MenuListActionSelectBtnComponent,
		MenuListFileSelectComponent,
		MenuListRadioComponent,
		MenuListOverflowComponent,
		ToolbarComponent,
		SvgImageDirective,
		DialogDraggableDirective,
		DialogResizableDirective,
		ModalDialogWindowComponent,
		ModalHeaderComponent,
		ModalFooterComponent,
		ModalBodyComponent,
		DialogBodyDescriptionComponent,
		ModalBodyInputComponent,
		MultistepDialogComponent,
		StepComponent,
		StepperComponent,
		StepFormComponent,
		StepGridComponent,
		UiCommonTabsComponent,
		UiCommonAlarmOverlayComponent,
		MessageBoxComponent,
		UiCommonAccordionComponent,
		UiCommonAccordionTestComponent,
		UiCommonAccordionItemComponent,
		UiCommonAccordionTreeComponent,
		UiCommonAccordionItemContentComponent,
		UiCommonAccordionItemActionsComponent,
		CollapsableListDirective,
		MenuListPopupComponent,
		UiCommonScriptEditorComponent,
		UiCommonScriptEditorTestComponent,
		UiCommonFilterScriptEditorComponent,
		UiCommonFilterScriptEditorTestComponent,
		CustomControlHostComponent,
		HistoryComponent,
		SingleLineTextComponent,
		MultiLineTextComponent,
		IntegerComponent,
		FloatComponent,
		PasswordComponent,
		SelectComponent,
		InputSelectComponent,
		InputSelectPopupComponent,
		DomainControlHostComponent,
		ModalFormComponent,
		ColorPickerComponent,
		TimeComponent,
		TranslationComponent,
		ImageViewComponent,
		ImageSizeDirective,
		CustomTranslateComponent,
		LookupHostComponent,
		ResizableOverlayComponent,
		ResizableOverlayContentComponent,
		RadioComponent,
		UiCommonLookupSelectComponent,
		CompositeComponent,
		GridDialogComponent,
		MasterDetailDialogComponent,
		MissingComponent,
		UiCommonLoadingComponent,
		ResizeObserverDirective,
		ScriptComponent,
		UiCommonLoadingComponent,
		AboutDialogDetailComponent,
		LicencesDialogDetailComponent,
		CertificatesDialogDetailComponent,
		QrCodeDetailComponent,
		UiCommonSelectDialogOptionsComponent,
		ScopedConfigDialogComponent,
		ListSelectionDialogComponent,
		UiCommonGridDialogSearchFormComponent,
		DynamicDomainControlComponent,
		LookupInputSelectHostComponent,
		UiCommonChartComponent,
		ActionComponent,
		UiCommonChartEvalComponent,
		TabbedDialogComponent,
		ImageSelectComponent,
		ImageSelectPopupComponent,
		DragDropTargetDirective,
		ImageSelectPopupComponent,
		MenuTabComponent,
		PageableLongTextDialogComponent,
		TextDisplayComponent,
		LongTextDialogComponent,
		UiCommonInfoBarComponent,
		UiCommonInputConfigDirective,
		RuleEditorComponent,
		ExpressionGroupComponent,
		ExpressionComponent,
		ExpressionOperandComponent,
		ExpressionFieldSelectorComponent,
		EntityFieldTreeSelectionComponent,
		ExpressionOperatorComponent,
		EnvironmentExpressionComponent,
		VariableTimePeriodComponent
	],
	exports: [
		ActionComponent,
		UiCommonItemListComponent,
		UiCommonItemListTreeComponent,
		UiCommonStatusBarContentComponent,
		UiCommonStatusBarElementComponent,
		UiCommonStatusBarComponent,
		ColourConverterDirective,
		SelectOnFocusDirective,
		IbanConverterDirective,
		UiCommonCodeConverterDirective,
		UiCommonMenuListSideBarDropdownComponent,
		UiCommonDropdownButtonComponent,
		UiCommonMenulistEditViewComponent,
		UiCommonPopupComponent,
		UiCommonPopupContainerComponent,
		UiCommonPopupMenuComponent,
		UiCommonLookupButtonComponent,
		UiCommonLookupInputComponent,
		UiCommonLookupInputTestComponent,
		UiCommonLookupInputSelectComponent,
		FormComponent,
		ToolbarComponent,
		SvgImageDirective,
		MenuListComponent,
		CollapsableListDirective,
		UiCommonAccordionComponent,
		DomainControlHostComponent,
		ResizableOverlayComponent,
		ImageViewComponent,
		UiCommonLookupSelectComponent,
		UiCommonLoadingComponent,
		ResizeObserverDirective,
		ScriptComponent,
		UrlComponent,
		UiCommonStyleEditor2Component,
		UiCommonGridDialogSearchFormComponent,
		UiCommonScriptEditorComponent,
		UiCommonChartComponent,
		MenuListDropdownComponent,
		UiCommonChartEvalComponent,
		UiCommonFilterScriptEditorComponent,
		DragDropTargetDirective,
		MenuTabComponent,
		TextEditorComponent,
		TextEditorRulerComponent,
		StepperComponent,
		StepComponent,
		UiCommonInfoBarComponent,
		UiCommonInputConfigDirective,
		RuleEditorComponent,
		ExpressionGroupComponent,
		ExpressionComponent,
		UiCommonLookupMultipleInputComponent
	],
})
export class UiCommonModule { }
