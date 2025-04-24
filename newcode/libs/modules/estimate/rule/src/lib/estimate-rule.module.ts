/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { EstimateRuleModuleInfo } from './model/estimate-rule-module-info.class';
import {UiCommonModule} from '@libs/ui/common';

const routes: Routes = [new BusinessModuleRoute(EstimateRuleModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule]
})
export class EstimateRuleModule {}
