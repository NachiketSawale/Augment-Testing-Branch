import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformCommonModule } from '@libs/platform/common';
import { EstimateSharedUrbConfigGridComponent } from './urb-config/components/urb-config-grid/urb-config-grid.component';
import { EstimateSharedUrbConfigGridWrapperComponent } from './urb-config/components/urb-config-grid-wrapper/urb-config-grid-wrapper.component';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	EstimateSharedReplaceResourceFieldsComponent
} from './common/services/estimate-replace-resource/estimate-main-replace-resource-fields/estimate-shared-replace-resource-fields.component';
import { ColumnConfigDetailComponent } from './components/column-config/column-config-detail/column-config-detail.component';
import { EstimateStructureGridComponent } from './components/estimate-structure/estimate-structure-grid.component';
import { EstimateMainRuleDetailComponent } from './components/estimate-rule-config/estimate-main-rule-detail.component';
import { EstimateShareCostGroupComponent } from './cost-group/estimate-share-cost-group.component';
import { UiExternalModule } from '@libs/ui/external';
import { ModifyResourceDialogComponent } from './modiy-resource/componets/modify-resource-dailog/modify-resource-dialog.component';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { ModifyResourceBasicSettingComponent } from './modiy-resource/componets/basic-setting/basic-setting.component';
import { ModifyResourceEstimateScopeComponent } from './modiy-resource/componets/estimate-scope/estimate-scope.component';
import { ModifyResourceModifyDetailComponent } from './modiy-resource/componets/modify-detail/modify-detail.component';
import { EstimateMainDetailColumnComponent } from './components/detail-column/detail-column-cell/estimate-main-detail-column.component';
import { EstimateMainDetailVariablesPopupComponent } from './components/detail-column/detail-column-popup/estimate-main-detail-variables-popup.component';
import { TotalsConfigDetailComponent } from './components/totals-config/totals-config-detail/totals-config-detail.component';
import { CostCodeAssignmentDetailComponent } from './components/totals-config/cost-code-assignment-detail/cost-code-assignment-detail.component';
import { RoundingConfigDetailComponent } from './components/rounding-config/rounding-config-detail/rounding-config-detail.component';

@NgModule({
	imports: [CommonModule, PlatformCommonModule, GridComponent, ReactiveFormsModule, UiCommonModule, MatAccordion, MatExpansionPanel, FormsModule, UiExternalModule],
	declarations:[
		EstimateSharedUrbConfigGridComponent,
		EstimateSharedUrbConfigGridWrapperComponent,
		EstimateSharedReplaceResourceFieldsComponent,
		ColumnConfigDetailComponent,
		EstimateStructureGridComponent,
		EstimateMainRuleDetailComponent,
		ModifyResourceDialogComponent,
		ModifyResourceBasicSettingComponent,
		ModifyResourceEstimateScopeComponent,
		ModifyResourceModifyDetailComponent,
		EstimateMainDetailColumnComponent,
		EstimateMainDetailVariablesPopupComponent,
		EstimateShareCostGroupComponent,
		TotalsConfigDetailComponent,
		CostCodeAssignmentDetailComponent,
		RoundingConfigDetailComponent
	]
})
export class EstimateSharedModule {}
