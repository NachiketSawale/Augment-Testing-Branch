/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ControllingConfigurationModuleInfo } from './model/controlling-configuration-module-info.class';
import { CONTROLLING_CONFIGURATION_COLUMN_DEFINITION_DATA_TOKEN, ControllingConfigurationColumnDefinitionDataService } from './services/controlling-configuration-column-definition-data.service';
import {
	CONTROLLING_CONFIGURATION_FORMULA_DEFINITION_DATA_TOKEN, ControllingConfigurationFormulaDefinitionDataService
} from './services/controlling-configuration-formula-definition-data.service';
import { FormulaSvgImageComponent } from './components/formula-svg-image/formula-svg-image.component';
import { FormsModule } from '@angular/forms';

import {
	CONTROLLING_CONFIGURATION_CHART_DATA_TOKEN,
	ControllingConfigurationChartDataService
} from './services/controlling-configuration-chart-data.service';
import { ChartConfigDialogComponent } from './components/chart-config-dialog/chart-config-dialog.component';
import { PlatformCommonModule } from '@libs/platform/common';

const routes: Routes = [new BusinessModuleRoute(ControllingConfigurationModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, FormsModule, PlatformCommonModule, GridComponent],
	providers: [
		{provide: CONTROLLING_CONFIGURATION_COLUMN_DEFINITION_DATA_TOKEN, useExisting: ControllingConfigurationColumnDefinitionDataService},
		{provide: CONTROLLING_CONFIGURATION_CHART_DATA_TOKEN, useExisting: ControllingConfigurationChartDataService},
		{provide: CONTROLLING_CONFIGURATION_FORMULA_DEFINITION_DATA_TOKEN, useExisting: ControllingConfigurationFormulaDefinitionDataService}
	],
	declarations:[
		FormulaSvgImageComponent,
		ChartConfigDialogComponent
	]
})
export class ControllingConfigurationModule {}
