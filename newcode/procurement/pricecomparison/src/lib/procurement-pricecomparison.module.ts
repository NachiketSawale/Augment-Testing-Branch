/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { PlatformCommonModule } from '@libs/platform/common';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ProcurementPricecomparisonModuleInfo } from './model/procurement-pricecomparison-module-info.class';
import { ProcurementPricecomparisonCompareSettingDialogBodyComponent } from './components/setting/compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ProcurementPricecomparisonCompareSettingBaseGridComponent } from './components/setting/compare-setting-base-grid/compare-setting-base-grid.component';
import { ProcurementPricecomparisonCompareSettingSummaryFieldComponent } from './components/setting/compare-setting-summary-field/compare-setting-summary-field.component';
import { ProcurementPricecomparisonCompareSettingQuoteFieldComponent } from './components/setting/compare-setting-quote-field/compare-setting-quote-field.component';
import { ProcurementPricecomparisonCompareSettingQuoteColumnComponent } from './components/setting/compare-setting-quote-column/compare-setting-quote-column.component';
import { ProcurementPricecomparisonCompareSettingGridLayoutComponent } from './components/setting/compare-setting-grid-layout/compare-setting-grid-layout.component';
import { ProcurementPricecomparisonCompareSettingCompareFieldComponent } from './components/setting/compare-setting-compare-field/compare-setting-compare-field.component';
import { ProcurementPricecomparisonCompareSettingBillingSchemaFieldComponent } from './components/setting/compare-setting-billing-schema-field/compare-setting-billing-schema-field.component';
import { ProcurementPricecomparisonCompareSettingBaseComponent } from './components/setting/compare-setting-base/compare-setting-base.component';
import { ProcurementPricecomparisonComparePrintProfileSaveComponent } from './components/print/profiles/compare-print-profile-save/compare-print-profile-save.component';
import { ProcurementPricecomparisonComparePrintProfileSelectorComponent } from './components/print/profiles/compare-print-profile-selector/compare-print-profile-selector.component';
import { ProcurementPricecomparisonComparePrintProfileSwitcherComponent } from './components/print/profiles/compare-print-profile-switcher/compare-print-profile-switcher.component';
import { ProcurementPricecomparisonComparePrintSummaryFieldComponent } from './components/print/settings/compare-print-summary-field/compare-print-summary-field.component';
import { ProcurementPricecomparisonComparePrintDialogBodyComponent } from './components/print/compare-print-dialog-body/compare-print-dialog-body.component';
import { ProcurementPricecomparisonComparePrintBoqRangeComponent } from './components/print/settings/compare-print-boq-range/compare-print-boq-range.component';
import { ProcurementPricecomparisonComparePrintItemTypeComponent } from './components/print/settings/compare-print-item-type/compare-print-item-type.component';
import { ProcurementPricecomparisonComparePrintQuoteColumnComponent } from './components/print/settings/compare-print-quote-column/compare-print-quote-column.component';
import { ProcurementPricecomparisonComparePrintQuoteFieldComponent } from './components/print/settings/compare-print-quote-field/compare-print-quote-field.component';
import { ProcurementPricecomparisonComparePrintGridLayoutComponent } from './components/print/settings/compare-print-grid-layout/compare-print-grid-layout.component';
import { ProcurementPricecomparisonComparePrintCompareFieldComponent } from './components/print/settings/compare-print-compare-field/compare-print-compare-field.component';
import { ProcurementPricecomparisonComparePrintBillingSchemaFieldComponent } from './components/print/settings/compare-print-billing-schema-field/compare-print-billing-schema-field.component';
import { ProcurementPricecomparisonComparePrintAbcAnalysisPageComponent } from './components/print/pages/compare-print-abc-analysis-page/compare-print-abc-analysis-page.component';
import { ProcurementPricecomparisonComparePrintBidderPageComponent } from './components/print/pages/compare-print-bidder-page/compare-print-bidder-page.component';
import { ProcurementPricecomparisonComparePrintBoqPageComponent } from './components/print/pages/compare-print-boq-page/compare-print-boq-page.component';
import { ProcurementPricecomparisonComparePrintColumnSettingPageComponent } from './components/print/pages/compare-print-column-setting-page/compare-print-column-setting-page.component';
import { ProcurementPricecomparisonComparePrintItemPageComponent } from './components/print/pages/compare-print-item-page/compare-print-item-page.component';
import { ProcurementPricecomparisonComparePrintLayoutPageComponent } from './components/print/pages/compare-print-layout-page/compare-print-layout-page.component';
import { ProcurementPricecomparisonComparePrintReportSettingPageComponent } from './components/print/pages/compare-print-report-setting-page/compare-print-report-setting-page.component';
import { ProcurementPricecomparisonComparePrintRowSettingPageComponent } from './components/print/pages/compare-print-row-setting-page/compare-print-row-setting-page.component';
import { ProcurementPricecomparisonComparePrintPageBaseComponent } from './components/print/pages/compare-print-page-base/compare-print-page-base.component';
import { ProcurementPricecomparisonCompareSettingBoqRangeComponent } from './components/setting/compare-setting-boq-range/compare-setting-boq-range.component';
import { ProcurementPricecomparisonCompareSettingItemTypeComponent } from './components/setting/compare-setting-item-type/compare-setting-item-type.component';
import { ProcurementPricecomparisonCompareSettingCustomSectionComponent } from './components/setting/compare-setting-custom-section/compare-setting-custom-section.component';
import { ProcurementPricecomparisonCompareSettingCommandBarComponent } from './components/setting/compare-setting-command-bar/compare-setting-command-bar.component';
import { ProcurementPricecomparisonCompareSettingRichEditorComponent } from './components/setting/compare-setting-rich-editor/compare-setting-rich-editor.component';
import { ProcurementPricecomparisonCompareDataSaveNewComponent } from './components/data/compare-data-save-new-version/compare-data-save-new-version.component';
import { ProcurementPricecomparisonCompareExportUserDecisionComponent } from './components/export/compare-export-user-decision/compare-export-user-decision.component';
import { ProcurementPricecomparisonCreateContractWizardViewComponent } from './components/wizard/create-contract-wizard-view/create-contract-wizard-view.component';
import { ProcurementPricecomparisonCreateContractWizardViewGridComponent } from './components/wizard/create-contract-wizard-view-grid/create-contract-wizard-view-grid.component';
import { ProcurementPricecomparisonCreateContractWizardContractViewComponent } from './components/wizard/create-contract-wizard-contract-view/create-contract-wizard-contract-view.component';
import { ProcurementPricecomparisonCreateContractEvaluatedHandleModeComponent } from './components/wizard/create-contract-evaluated-handle-mode/create-contract-evaluated-handle-mode.component';
import { ProcurementPricecomparisonCreateContractShowOptionViewComponent } from './components/wizard/create-contract-show-option-view/create-contract-show-option-view.component';
import { ProcurementPricecomparisonCreateContractResultComponent } from './components/wizard/create-contract-result/create-contract-result.component';
import {
	PriceComparisonChartComponent
} from './components/chart/price-comparison-chart/price-comparison-chart.component';
import { UiExternalModule } from '@libs/ui/external';
import {
	ProcurementPriceComparisonSetAdHocPriceComponent
} from './components/set-ad-hoc-price/set-ad-hoc-price.component';

const routes: Routes = [new BusinessModuleRoute(ProcurementPricecomparisonModuleInfo.instance)];

@NgModule({
	imports: [
		CommonModule, RouterModule.forChild(routes),
		UiCommonModule,
		PlatformCommonModule,
		GridComponent,
		MatTabsModule,
		UiExternalModule
	],
	providers: [],
	declarations: [
		ProcurementPricecomparisonCompareSettingBaseComponent,
		ProcurementPricecomparisonCompareSettingDialogBodyComponent,
		ProcurementPricecomparisonCompareSettingBaseGridComponent,
		ProcurementPricecomparisonCompareSettingSummaryFieldComponent,
		ProcurementPricecomparisonCompareSettingQuoteFieldComponent,
		ProcurementPricecomparisonCompareSettingQuoteColumnComponent,
		ProcurementPricecomparisonCompareSettingGridLayoutComponent,
		ProcurementPricecomparisonCompareSettingCompareFieldComponent,
		ProcurementPricecomparisonCompareSettingBillingSchemaFieldComponent,
		ProcurementPricecomparisonComparePrintBillingSchemaFieldComponent,
		ProcurementPricecomparisonComparePrintBoqRangeComponent,
		ProcurementPricecomparisonComparePrintCompareFieldComponent,
		ProcurementPricecomparisonComparePrintDialogBodyComponent,
		ProcurementPricecomparisonComparePrintGridLayoutComponent,
		ProcurementPricecomparisonComparePrintItemTypeComponent,
		ProcurementPricecomparisonComparePrintProfileSaveComponent,
		ProcurementPricecomparisonComparePrintProfileSelectorComponent,
		ProcurementPricecomparisonComparePrintProfileSwitcherComponent,
		ProcurementPricecomparisonComparePrintQuoteColumnComponent,
		ProcurementPricecomparisonComparePrintQuoteFieldComponent,
		ProcurementPricecomparisonComparePrintSummaryFieldComponent,
		ProcurementPricecomparisonComparePrintAbcAnalysisPageComponent,
		ProcurementPricecomparisonComparePrintBidderPageComponent,
		ProcurementPricecomparisonComparePrintBoqPageComponent,
		ProcurementPricecomparisonComparePrintColumnSettingPageComponent,
		ProcurementPricecomparisonComparePrintItemPageComponent,
		ProcurementPricecomparisonComparePrintLayoutPageComponent,
		ProcurementPricecomparisonComparePrintReportSettingPageComponent,
		ProcurementPricecomparisonComparePrintRowSettingPageComponent,
		ProcurementPricecomparisonComparePrintPageBaseComponent,
		ProcurementPricecomparisonCompareSettingBoqRangeComponent,
		ProcurementPricecomparisonCompareSettingItemTypeComponent,
		ProcurementPricecomparisonCompareSettingCustomSectionComponent,
		ProcurementPricecomparisonCompareSettingCommandBarComponent,
		ProcurementPricecomparisonCompareSettingRichEditorComponent,
		ProcurementPricecomparisonCompareDataSaveNewComponent,
		ProcurementPricecomparisonCompareExportUserDecisionComponent,
		ProcurementPricecomparisonCreateContractWizardViewComponent,
		ProcurementPricecomparisonCreateContractWizardViewGridComponent,
		ProcurementPricecomparisonCreateContractWizardContractViewComponent,
		ProcurementPricecomparisonCreateContractEvaluatedHandleModeComponent,
		ProcurementPricecomparisonCreateContractShowOptionViewComponent,
		ProcurementPricecomparisonCreateContractResultComponent,
		PriceComparisonChartComponent,
		ProcurementPriceComparisonSetAdHocPriceComponent,
	]
})
export class ProcurementPricecomparisonModule {
}
