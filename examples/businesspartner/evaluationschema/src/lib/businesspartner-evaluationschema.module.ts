/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinesspartnerEvaluationschemaModuleInfo } from './model/businesspartner-evaluationschema-module-info.class';
import {BusinessModuleRoute} from '@libs/ui/business-base';

const routes: Routes = [
	new BusinessModuleRoute(BusinesspartnerEvaluationschemaModuleInfo.instance)
];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BusinesspartnerEvaluationSchemaModule {}
