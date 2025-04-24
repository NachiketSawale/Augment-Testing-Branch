/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { QtoFormulaModuleInfo } from './model/qto-formula-module-info.class';
import { QTO_FORMULA_RUBRIC_CATEGORY_GRID_DATA_TOKEN, QtoFormulaRubricCategoryGridDataService } from './services/qto-formula-rubric-category-grid-data.service';
import { QTO_FORMULA_RUBRIC_CATEGORY_GRID_BEHAVIOR_TOKEN, QtoFormulaRubricCategoryGridBehavior } from './behaviors/qto-formula-rubric-category-grid-behavior.service';

const routes: Routes = [new BusinessModuleRoute(QtoFormulaModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{provide: QTO_FORMULA_RUBRIC_CATEGORY_GRID_DATA_TOKEN, useExisting: QtoFormulaRubricCategoryGridDataService},
		{provide: QTO_FORMULA_RUBRIC_CATEGORY_GRID_BEHAVIOR_TOKEN, useExisting: QtoFormulaRubricCategoryGridBehavior},
	],
})
export class QtoFormulaModule {}
