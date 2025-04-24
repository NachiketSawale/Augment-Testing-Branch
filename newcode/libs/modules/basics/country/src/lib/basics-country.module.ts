/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiCommonModule } from '@libs/ui/common';
import { BasicsCountryModuleInfo } from './model/basics-country-module-info.class';
import { BASICS_COUNTRY_DATA_TOKEN, BasicsCountryDataService } from './services/basics-country-data.service';
import { BASICS_COUNTRY_BEHAVIOR_TOKEN, BasicsCountryBehavior } from './behaviors/basics-country-behavior.service';
import { BASICS_COUNTRY_STATE_DATA_TOKEN, BasicsCountryStateDataService } from './services/basics-country-state-data.service';
import { BASICS_COUNTRY_STATE_BEHAVIOR_TOKEN, BasicsCountryStateBehavior } from './behaviors/basics-country-state-behavior.service';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { BASICS_COUNTRY_VALIDATION_TOKEN, BasicsCountryValidationService } from './services/basics-country-validation.service';
import { BASICS_COUNTRY_STATE_VALIDATION_TOKEN, BasicsCountryStateValidationService } from './services/basics-country-state-validation.service';

const routes: Routes = [new BusinessModuleRoute( BasicsCountryModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers: [
		{ provide: BASICS_COUNTRY_DATA_TOKEN, useExisting: BasicsCountryDataService },
		{ provide: BASICS_COUNTRY_BEHAVIOR_TOKEN, useExisting: BasicsCountryBehavior },
		{ provide: BASICS_COUNTRY_STATE_DATA_TOKEN, useExisting: BasicsCountryStateDataService },
		{ provide: BASICS_COUNTRY_STATE_BEHAVIOR_TOKEN, useExisting: BasicsCountryStateBehavior },
		{ provide: BASICS_COUNTRY_VALIDATION_TOKEN, useExisting: BasicsCountryValidationService },
		{ provide: BASICS_COUNTRY_STATE_VALIDATION_TOKEN, useExisting: BasicsCountryStateValidationService }
	],
})
export class BasicsCountryModule {}
