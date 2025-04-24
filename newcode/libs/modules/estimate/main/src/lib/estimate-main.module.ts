/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { EstimateMainModuleInfo } from './model/estimate-main-module-info.class';
import { ESTIMATE_MAIN_ROOT_ASSIGNMENT_BEHAVIOR_TOKEN, EstimateMainRootAssignmentBehavior } from './containers/root-assignment/estimate-main-root-assignment-behavior.service';
import { ESTIMATE_MAIN_ASSEMBLY_STRUCTURE_BEHAVIOR_TOKEN, EstimateMainAssemblyStructureBehavior } from './containers/assembly-structure/estimate-main-assembly-structure-behavior.service';
import { ESTIMATE_MAIN_LINE_ITEM_QUANTITY_BEHAVIOR_TOKEN, EstimateMainLineItemQuantityBehavior } from './containers/line-item-quantity/estimate-main-line-item-quantity-behavior.service';
import { ESTIMATE_MAIN_ACTIVITY_DATA_TOKEN, EstimateMainActivityDataService } from './containers/activity/estimate-main-activity-data.service';
import { FormsModule } from '@angular/forms';
import { PlatformCommonModule } from '@libs/platform/common';
import { EstimateMainUpdateMaterialPackageBasicOptionComponent } from './components/wizards/update-material-package/update-material-package-basic-option/update-material-package-basic-option.component';
import { EstimateMainUpdateMaterialPackageUpdateItemComponent } from './components/wizards/update-material-package/update-material-package-update-item/update-material-package-update-item.component';
import { PriceAdjustCopyTenderComponent } from './components/price-adjust-copy-tender/price-adjust-copy-tender.component';
import { OutputPartialComponent } from './containers/rule-script-output/output-partial.component';
import { BackwardCalculationDialogComponent } from './components/wizards/backward-calculation/backward-calculation-dialog/backward-calculation-dialog.component';
import { BackwardCalculationDialogScopeComponent } from './components/wizards/backward-calculation/backward-calculation-dialog-scope/backward-calculation-dialog-scope.component';
import { RightSelectionStatementComponent } from './components/selection-statement/right-selection-statement/right-selection-statement.component';
import { UiExternalModule } from '@libs/ui/external';
import { SelectionStatementContainerComponent } from './components/selection-statement/selection-statement-container/selection-statement-container.component';
import { MainExpertFilterComponent } from './components/selection-statement/main-expert-filter/main-expert-filter.component';
import { MainObjectExpertFilterComponent } from './components/selection-statement/main-object-expert-filter/main-object-expert-filter.component';
import { CreateMatPkgBasicOptionComponent } from './components/wizards/create-material-package/create-material-package-basic-option/create-material-package-basic-option.component';
import { CreateMatPkgSelectionComponent } from './components/wizards/create-material-package/create-material-package-selection/create-material-package-selection.component';
import { CreateMatPkgSimulationComponent } from './components/wizards/create-material-package/create-material-package-simulation/create-material-package-simulation.component';
import { CreateMatPkgSelectionMatAndCCComponent } from './components/wizards/create-material-package/create-material-package-selection/create-material-package-selection-material-cost-code/create-material-package-selection-material-cost-code.component';
import { EstMainUdpCheckBoxListComponent } from './wizards/create-bid/2-structure-setting/components/udp-checkbox-list.component';
import { EstimateConfigDialogComponent } from './components/estimate-config-dialog/estimate-config-dialog.component';
import { PriceAdjustModifyComponent } from './components/price-adjust-modify/price-adjust-modify.component';
import { BasicsSharedModule } from '@libs/basics/shared';
// Define routes for the Estimate Main module
const routes: Routes = [new BusinessModuleRoute(EstimateMainModuleInfo.instance)];

/*
 * NgModule for the Estimate Main module
 */
@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, FormsModule, PlatformCommonModule, GridComponent, UiExternalModule, BasicsSharedModule],
	declarations: [
		EstimateMainUpdateMaterialPackageBasicOptionComponent,
		EstimateMainUpdateMaterialPackageUpdateItemComponent,
		PriceAdjustCopyTenderComponent,
		PriceAdjustModifyComponent,
		BackwardCalculationDialogComponent,
		BackwardCalculationDialogScopeComponent,
		OutputPartialComponent,
		RightSelectionStatementComponent,
		SelectionStatementContainerComponent,
		MainObjectExpertFilterComponent,
		MainExpertFilterComponent,
		EstMainUdpCheckBoxListComponent,
		EstimateConfigDialogComponent,
		CreateMatPkgBasicOptionComponent,
		CreateMatPkgSelectionComponent,
		CreateMatPkgSelectionMatAndCCComponent,
		CreateMatPkgSimulationComponent
	],
	// Provide behavior token
	providers: [
		{ provide: ESTIMATE_MAIN_ASSEMBLY_STRUCTURE_BEHAVIOR_TOKEN, useExisting: EstimateMainAssemblyStructureBehavior },
		{ provide: ESTIMATE_MAIN_ROOT_ASSIGNMENT_BEHAVIOR_TOKEN, useExisting: EstimateMainRootAssignmentBehavior },
		{ provide: ESTIMATE_MAIN_ACTIVITY_DATA_TOKEN, useExisting: EstimateMainActivityDataService },
		{ provide: ESTIMATE_MAIN_LINE_ITEM_QUANTITY_BEHAVIOR_TOKEN, useExisting: EstimateMainLineItemQuantityBehavior },
	],
})
export class EstimateMainModule {}

