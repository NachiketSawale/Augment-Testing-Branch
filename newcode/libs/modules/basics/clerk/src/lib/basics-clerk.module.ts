/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiCommonModule } from '@libs/ui/common';
import { BasicsClerkModuleInfo } from './model/basics-clerk-module-info.model';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { BASICS_CLERK_VALIDATION_TOKEN, BasicsClerkValidationService } from './services/basics-clerk-validation.service';

const routes: Routes = [new BusinessModuleRoute(BasicsClerkModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers: [
		{ provide: BASICS_CLERK_VALIDATION_TOKEN, useExisting: BasicsClerkValidationService },
	],
})
export class BasicsClerkModule {}
