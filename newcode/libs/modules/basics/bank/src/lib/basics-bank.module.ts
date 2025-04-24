/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiCommonModule } from '@libs/ui/common';
import { BasicsBankModuleInfo } from './model/basics-bank-module-info.class';
import { BASICS_BANK_DATA_TOKEN, BasicsBankDataService } from './services/basics-bank-data.service';
import { BusinessModuleRoute } from '@libs/ui/business-base';


const routes: Routes = [new BusinessModuleRoute(BasicsBankModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers: [
		{ provide: BASICS_BANK_DATA_TOKEN, useExisting: BasicsBankDataService }
	],
})
export class BasicsBankModule {}
