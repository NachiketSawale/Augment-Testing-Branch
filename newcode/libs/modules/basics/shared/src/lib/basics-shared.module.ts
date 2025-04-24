import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { PlatformCommonModule } from '@libs/platform/common';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { BasicsSharedMaterialSearchNavigatorComponent } from './material-search/components/material-search-navigator/material-search-navigator.component';
import { BasicsSharedMaterialSearchListComponent } from './material-search/components/material-search-list/material-search-list.component';
import { BasicsSharedMaterialSearchComponent } from './material-search/components/material-search/material-search.component';
import { BasicsSharedMaterialSearchHeaderComponent } from './material-search/components/material-search-header/material-search-header.component';
import { BasicsSharedMaterialSearchBodyComponent } from './material-search/components/material-search-body/material-search-body.component';
import { BasicsSharedMaterialSearchFooterComponent } from './material-search/components/material-search-footer/material-search-footer.component';
import { BasicsSharedMaterialSearchSidebarComponent } from './material-search/components/material-search-sidebar/material-search-sidebar.component';
import { BasicsSharedMaterialSearchItemComponent } from './material-search/components/material-search-item/material-search-item.component';
import { BasicsSharedMaterialSearchDetailComponent } from './material-search/components/material-search-detail/material-search-detail.component';
import { BasicsSharedMaterialSearchViewComponent } from './material-search/components/material-search-view/material-search-view.component';
import { BasicsSharedMaterialSearchValidationComponent } from './material-search/components/material-search-validation/material-search-validation.component';
import { BasicsSharedMaterialSearchCollapseComponent } from './material-search/components/material-search-collapse/material-search-collapse.component';
import { BasicsSharedMaterialSearchPriceSliderComponent } from './material-search/components/material-search-price-slider/material-search-price-slider.component';
import { BasicsSharedMaterialSearchLoadAttributeComponent } from './material-search/components/material-search-load-attribute/material-search-load-attribute.component';
import { BasicsSharedMaterialLookupComponent } from './material-lookup/components/material-lookup/material-lookup.component';
import { BasicsSharedStatusChangeEditorComponent } from './status-change/components/status-change-editor/status-change-editor.component';
import { BasicsSharedStatusChangeDialogComponent } from './status-change/components/status-change-dialog/status-change-dialog.component';
import { BasicsSharedStatusChangeHistoryComponent } from './status-change/components/status-change-history/status-change-history.component';
import { BasicsSharedStatusChangeResultComponent } from './status-change/components/status-change-result/status-change-result.component';
import { BasicsSharedMaterialItemDescriptionComponent } from './material-search/components/material-item-description/material-item-description.component';
import { BasicsSharedMaterialItemOperationComponent } from './material-search/components/material-item-operation/material-item-operation.component';
import { BasicsSharedMaterialAlternativeListComponent } from './material-search/components/material-alternative-list/material-alternative-list.component';
import { BasicsSharedMaterialPriceListPopupComponent } from './material-search/components/material-price-list-popup/material-price-list-popup.component';
import {
	BasicsSharedDialogLookupInputBaseComponent,
	BasicsSharedPopupDialogBodyComponent,
	BasicsSharedSearchDialogBodyComponent,
	BasicsSharedFormDialogBodyComponent
} from './form-dialog-lookup-base';
import { BasicsSharedTelephoneDialogComponent } from './telephone-lookup';
import {
	BasicsSharedAddressDialogComponent,
} from './address-lookup';
import { UiMapModule } from '@libs/ui/map';
import { BasicsSharedAddressMapWrapperComponent } from './address-lookup/components/address-map-wrapper/address-map-wrapper.component';
import {BasicsSharedPhotoEntityViewerComponent} from './photo-entity-viewer/components/photo/photo.component';
import {BasicsSharedPlainTextContainerComponent, BasicsSharedPlainTextExtendComponent} from './plain-text';
import { BasicsSharedUserFormDialogBodyComponent } from './user-form';
import { UiExternalModule } from '@libs/ui/external';
import {BasicsSharedPriceConditionHeaderComponent} from './price-condition/components/price-condition-header/price-condition-header.component';
import {BasicsSharedPriceConditionFooterComponent} from './price-condition/components/price-condition-footer/price-condition-footer.component';
import { BasicsSharedCharacteristicCodeDialogComponent } from './characteristic-lookup/components/characteristic-code-dialog/characteristic-code-dialog.component';
import {
	BasicsSharedChartColorConfigDialogComponent
} from './chart-config/components/chart-color-config-dialog/chart-color-config-dialog.component';
import { BasicsSharedScriptEditorContainerComponent } from './script-editor';
import { BasicsSharedCharacteristicBulkEditorComponent } from './characteristic-bulk-editor/components/characteristic-bulk-editor/characteristic-bulk-editor.component';
import { BasicsSharedSyncBim360DocumentsDialogComponent } from './bim360/components/sync-bim360-documents-dialog/sync-bim360-documents-dialog.component';
import { BasicsSharedSyncDocumentsToBim360DialogComponent } from './bim360/components/sync-documents-to-bim360-dialog/sync-documents-to-bim360-dialog.component';
import { BasicsSharedExportComponent } from './export/components/basics-shared-export/basics-shared-export.component';

import { BasicsSharedChartContainerCommonComponent } from './chart-container';
import { BasicsSharedCashFlowProjectionChartComponent } from './cash-flow/components/basics-shared-cash-flow-projection-chart/basics-shared-cash-flow-projection-chart.component';
import { SyncBim360IssuesDialogComponent } from './bim360/components/sync-bim360-issues-dialog/sync-bim360-issues-dialog.component';
import { SyncBim360RfisDialogComponent } from './bim360/components/sync-bim360-rfis-dialog/sync-bim360-rfis-dialog.component';
import { BasicsSharedTotalCostCompositeComponent } from './basics-shared-total-cost-composite/basics-shared-total-cost-composite.component';
import { BasicsSharedCommentViewerComponent} from './pin-board';
import { BasicsSharedCommentItemComponent } from './pin-board/components/comment-item/comment-item.component';
import { BasicsSharedCommentEditorComponent } from './pin-board/components/comment-editor/comment-editor.component';
import { BasicsSharedEmotionPopupComponent } from './pin-board/components/emotion-popup/emotion-popup.component';
import { BasicsSharedReadOnlyGridComponent } from './components/read-only-grid/read-only-grid.component';
import {
	BasicsSharedEntityFilterComponent,
	BasicsSharedEntityFilterBarComponent,
	BasicsSharedEntityFilterSelectionComponent,
	BasicsSharedEntityFilterItemComponent,
	BasicsSharedEntityFilterSavedComponent,
	BasicsSharedEntityFilterBooleanComponent,
	BasicsSharedEntityFilterListComponent,
	BasicsSharedEntityFilterDomainComponent,
	BasicsSharedEntityFilterAttributeComponent,
	BasicsSharedEntityFilterSearchFieldListComponent,
	BasicsSharedEntityFilterSearchInfoComponent,
	BasicsSharedEntityFilterGridComponent,
	BasicsSharedEntityFilterResultComponent,
	BasicsSharedEntityFilterResultToolbarComponent,
	BasicsSharedEntityFilterResultGridComponent,
	BasicsSharedEntityFilterResultPaginationComponent,
	BasicsSharedEntityFilterResultPreviewComponent,
	BasicsSharedEntityFilterResultPageSizeListComponent,
	BasicsSharedEntityFilterProfileConfigComponent,
	BasicsSharedEntityFilterSaveOptionsComponent,
} from './entity-filter';
import {
	BasicsSharedMaterialFilterComponent,
	BasicsSharedMaterialFilterTranslatePipe,
	BasicsSharedMaterialFilterResultViewComponent,
	BasicsSharedMaterialFilterResultPaginationComponent,
	BasicsSharedMaterialFilterResultPreviewComponent,
	BasicsSharedMaterialFilterResultToolbarComponent,
	BasicsSharedMaterialFilterResultGridComponent,
	BasicsSharedMaterialFilterPreviewHeaderComponent,
	BasicsSharedMaterialFilterItemAttributesComponent,
	BasicsSharedMaterialFilterItemDocumentsComponent,
	BasicsSharedMaterialFilterDocumentDialogComponent
} from './material-filter';
import { BasicsSharedUniqueFieldsProfileLookupComponent } from './unique-fields-profile-lookup/components/profile-lookup.component';
import { BasicsSharedNumberLessThanDirective, BasicsSharedNumberGreaterThanDirective, BasicsSharedValidationErrorDirective } from './utilities';
import { BasicsSharedLoadMoreListComponent } from './load-more-list';
import { BasicsSharedMaterialStructureListComponent } from './material-search/components/material-structure-list/material-structure-list.component';

const routes: Routes = [
	{
		path: 'material-search',
		component: BasicsSharedMaterialSearchComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		RouterModule.forChild(routes),
		FormsModule,
		MatPaginatorModule,
		PlatformCommonModule,
		MatSliderModule,
		GridComponent,
		UiCommonModule,
		UiMapModule,
		MatProgressSpinnerModule,
		UiExternalModule,
	],
	declarations: [
		BasicsSharedMaterialSearchNavigatorComponent,
		BasicsSharedMaterialSearchListComponent,
		BasicsSharedMaterialSearchComponent,
		BasicsSharedMaterialSearchHeaderComponent,
		BasicsSharedMaterialSearchBodyComponent,
		BasicsSharedMaterialSearchFooterComponent,
		BasicsSharedMaterialSearchSidebarComponent,
		BasicsSharedMaterialSearchItemComponent,
		BasicsSharedMaterialSearchDetailComponent,
		BasicsSharedMaterialSearchViewComponent,
		BasicsSharedMaterialSearchValidationComponent,
		BasicsSharedMaterialSearchCollapseComponent,
		BasicsSharedMaterialSearchPriceSliderComponent,
		BasicsSharedMaterialSearchLoadAttributeComponent,
		BasicsSharedMaterialLookupComponent,
		BasicsSharedStatusChangeEditorComponent,
		BasicsSharedStatusChangeDialogComponent,
		BasicsSharedStatusChangeHistoryComponent,
		BasicsSharedStatusChangeResultComponent,
		BasicsSharedMaterialItemDescriptionComponent,
		BasicsSharedMaterialItemOperationComponent,
		BasicsSharedMaterialAlternativeListComponent,
		BasicsSharedMaterialPriceListPopupComponent,
		BasicsSharedDialogLookupInputBaseComponent,
		BasicsSharedTelephoneDialogComponent,
		BasicsSharedSearchDialogBodyComponent,
		BasicsSharedPopupDialogBodyComponent,
		BasicsSharedFormDialogBodyComponent,
		BasicsSharedAddressDialogComponent,
		BasicsSharedAddressMapWrapperComponent,
		BasicsSharedExportComponent,
		BasicsSharedTotalCostCompositeComponent,
		BasicsSharedPhotoEntityViewerComponent,
		BasicsSharedPlainTextContainerComponent,
		BasicsSharedPlainTextExtendComponent,
		BasicsSharedUserFormDialogBodyComponent,
		BasicsSharedPriceConditionHeaderComponent,
		BasicsSharedPriceConditionFooterComponent,
		BasicsSharedCharacteristicCodeDialogComponent,
		BasicsSharedChartColorConfigDialogComponent,
		BasicsSharedChartContainerCommonComponent,
		BasicsSharedScriptEditorContainerComponent,
		BasicsSharedCharacteristicBulkEditorComponent,
		BasicsSharedSyncBim360DocumentsDialogComponent,
		BasicsSharedSyncDocumentsToBim360DialogComponent,
		BasicsSharedCashFlowProjectionChartComponent,
		SyncBim360IssuesDialogComponent,
		SyncBim360RfisDialogComponent,
		BasicsSharedEmotionPopupComponent,
		BasicsSharedCommentEditorComponent,
		BasicsSharedCommentItemComponent,
		BasicsSharedCommentViewerComponent,
		BasicsSharedReadOnlyGridComponent,
		BasicsSharedMaterialFilterComponent,
		BasicsSharedEntityFilterComponent,
		BasicsSharedEntityFilterBarComponent,
		BasicsSharedEntityFilterSelectionComponent,
		BasicsSharedEntityFilterItemComponent,
		BasicsSharedMaterialFilterTranslatePipe,
		BasicsSharedEntityFilterSavedComponent,
		BasicsSharedMaterialFilterResultViewComponent,
		BasicsSharedMaterialFilterResultPaginationComponent,
		BasicsSharedMaterialFilterResultPreviewComponent,
		BasicsSharedMaterialFilterResultToolbarComponent,
		BasicsSharedMaterialFilterResultGridComponent,
		BasicsSharedMaterialFilterPreviewHeaderComponent,
		BasicsSharedMaterialFilterItemAttributesComponent,
		BasicsSharedMaterialFilterItemDocumentsComponent,
		BasicsSharedMaterialFilterDocumentDialogComponent,
		BasicsSharedEntityFilterBooleanComponent,
		BasicsSharedEntityFilterListComponent,
		BasicsSharedEntityFilterDomainComponent,
		BasicsSharedEntityFilterAttributeComponent,
		BasicsSharedEntityFilterSearchFieldListComponent,
		BasicsSharedEntityFilterSearchInfoComponent,
		BasicsSharedEntityFilterGridComponent,
		BasicsSharedEntityFilterResultComponent,
		BasicsSharedEntityFilterResultToolbarComponent,
		BasicsSharedEntityFilterResultGridComponent,
		BasicsSharedEntityFilterResultPaginationComponent,
		BasicsSharedEntityFilterResultPreviewComponent,
		BasicsSharedEntityFilterResultPageSizeListComponent,
		BasicsSharedEntityFilterProfileConfigComponent,
		BasicsSharedEntityFilterSaveOptionsComponent,
		BasicsSharedUniqueFieldsProfileLookupComponent,
		BasicsSharedNumberLessThanDirective,
		BasicsSharedNumberGreaterThanDirective,
		BasicsSharedValidationErrorDirective,
		BasicsSharedLoadMoreListComponent,
		BasicsSharedMaterialStructureListComponent
	],
	exports: [
		BasicsSharedDialogLookupInputBaseComponent,
		BasicsSharedMaterialSearchComponent,
		BasicsSharedMaterialItemDescriptionComponent,
		BasicsSharedTelephoneDialogComponent,
		BasicsSharedAddressDialogComponent,
		BasicsSharedPhotoEntityViewerComponent,
		BasicsSharedPlainTextContainerComponent,
		BasicsSharedPlainTextExtendComponent,
		BasicsSharedChartColorConfigDialogComponent,
		BasicsSharedScriptEditorContainerComponent,
		BasicsSharedChartContainerCommonComponent,
		BasicsSharedReadOnlyGridComponent,
		BasicsSharedUniqueFieldsProfileLookupComponent,
		BasicsSharedNumberLessThanDirective,
		BasicsSharedNumberGreaterThanDirective,
		BasicsSharedValidationErrorDirective
	],
})
export class BasicsSharedModule {
}
